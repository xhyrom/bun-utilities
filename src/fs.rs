use std::{fs, io, path::Path};

#[napi(object)]
pub struct Recursive {
    pub recursive: Option<bool>,
}

#[napi(object)]
pub struct CopyDirOptions {
    pub recursive: Option<bool>,
    pub copy_files: Option<bool>,
}

#[napi]
pub fn rmdir(path: String, options: Option<Recursive>) -> String {
    let options = options.unwrap_or(Recursive {
        recursive: Some(false),
    });

    let recursive = options.recursive.unwrap_or(false);

    let path = Path::new(&path);
    let error;
    if !path.exists() {
        return "Invalid file".to_string();
    }

    let result = match recursive {
        true => fs::remove_dir_all(path),
        false => fs::remove_dir(path),
    };

    let message = match result {
        Ok(()) => "ok",
        Err(e) => {
            error = format!("{}", e.kind().to_string());
            &error
        }
    };

    message.to_string()
}

#[napi]
pub fn copyfile(src: String, dest: String, options: Option<Recursive>) -> String {
    let options = options.unwrap_or(Recursive {
        recursive: Some(false),
    });

    let recursive = options.recursive.unwrap_or(false);

    let source = Path::new(&src);
    let destination = Path::new(&dest);

    if !source.exists() {
        return "Invalid source file".to_string();
    }

    if destination.exists() && !recursive {
        return "Destination file exists".to_string();
    }

    let error;
    let message = match __copyfile(source, destination) {
        Ok(..) => "ok",
        Err(e) => {
            error = format!("{}", e.kind().to_string());
            &error
        }
    };

    return message.to_string();
}

// Internal implementation for copyfile function
fn __copyfile(src: &Path, dest: &Path) -> io::Result<u64> {
    fs::copy(src, dest)
}

#[napi]
pub fn copydir(src: String, dest: String, options: Option<CopyDirOptions>) -> String {
    let options = options.unwrap_or(CopyDirOptions {
        recursive: Some(false),
        copy_files: Some(true),
    });

    let recursive = options.recursive.unwrap_or(false);
    let copy_files = options.copy_files.unwrap_or(true);

    let source = Path::new(&src);
    let destination = Path::new(&dest);

    if !source.exists() {
        return "Invalid source folder".to_string();
    }

    if destination.exists() && !recursive {
        return "Destination folder exists".to_string();
    }

    if destination.exists() && recursive {
        rmdir(
            destination.to_str().unwrap().to_string(),
            Some(Recursive {
                recursive: Some(true),
            }),
        );
    }

    let message = match __copydir(source, destination, recursive, copy_files) {
        Ok(..) => "ok",
        Err(e) => {
            format!("{}", e.kind().to_string())
        }
    };

    return message.to_string();
}

// Internal implementation for copydir function
fn __copydir(
    src: impl AsRef<Path>,
    dest: impl AsRef<Path>,
    recursive: bool,
    copy_files: bool,
) -> io::Result<()> {
    fs::create_dir_all(&dest)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            __copydir(
                entry.path().to_str().unwrap().to_string(),
                dest.as_ref().join(entry.file_name()),
                recursive,
                copy_files,
            )?;
        } else if copy_files {
            let dest_path = dest.as_ref().join(entry.file_name());
            if dest_path.exists() && recursive {
                __copyfile(&entry.path(), &dest_path)?;
            } else {
                __copyfile(&entry.path(), &dest_path)?;
            }
        }
    }
    Ok(())
}
