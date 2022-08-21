use std::{fs, io, path::Path};

#[napi(object)]
pub struct RecursiveOptions {
    pub recursive: Option<bool>,
}

#[napi(object)]
pub struct CopyDirOptions {
    pub recursive: Option<bool>,
    pub copy_files: Option<bool>,
}

#[napi]
pub fn rmdir(path: String, options: Option<RecursiveOptions>) -> String {
    let options = options.unwrap_or(RecursiveOptions {
        recursive: Some(false),
    });

    let recursive = options.recursive.unwrap_or(false);

    let path = Path::new(&path);

    if !path.exists() {
        return "Invalid file".to_string();
    }

    let result = match recursive {
        true => fs::remove_dir_all(path),
        false => fs::remove_dir(path),
    };

    match result {
        Ok(()) => "ok".to_string(),
        Err(e) => format!("{}", e.kind()),
    }
}

#[napi]
pub fn copyfile(src: String, dest: String, options: Option<RecursiveOptions>) -> String {
    let options = options.unwrap_or(RecursiveOptions {
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

    match __copyfile(source, destination) {
        Ok(..) => "ok".to_string(),
        Err(e) => format!("{}", e.kind()),
    }
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

    if destination.exists() {
        if recursive {
            rmdir(
                destination.to_str().unwrap().to_string(),
                Some(RecursiveOptions {
                    recursive: Some(true),
                }),
            );
        } else {
            return "Destination folder exists".to_string();
        }
    }

    match __copydir(source, destination, recursive, copy_files) {
        Ok(..) => String::from("ok"),
        Err(e) => format!("{}", e.kind()),
    }
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
