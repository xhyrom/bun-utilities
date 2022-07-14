use std::{io, path::Path, fs};

#[napi(object)]
pub struct RmDirOptions {
    pub recursive: Option<bool>,
}

#[napi(object)]
pub struct CopyDirOptions {
    pub recursive: Option<bool>,
    pub copy_files: Option<bool>,
}

#[napi]
pub fn rmdir(path: String, options: Option<RmDirOptions>) -> String {
    let options = options.unwrap_or(RmDirOptions {
        recursive: Some(false)
    });

    let recursive = options.recursive.unwrap_or(false);

    let error;
    if Path::new(&path).exists() {
        if recursive {
            let message = match fs::remove_dir_all(path) {
                Ok(()) => "ok",
                Err(e) => {
                    error = format!("{}", e.kind().to_string());
                    &error
                },
            };

            return message.to_string();
        } else {
            let message = match fs::remove_dir(path) {
                Ok(()) => "ok",
                Err(e) => {
                    error = format!("{}", e.kind().to_string());
                    &error
                }
            };

            return message.to_string();
        }
    } else {
        return "Invalid file".to_string()
    }
}

#[napi]
pub fn copydir(src: String, dest: String, options: Option<CopyDirOptions>) -> String {
    let options = options.unwrap_or(CopyDirOptions {
        recursive: Some(false),
        copy_files: Some(true)
    });

    let recursive = options.recursive.unwrap_or(false);
    let copy_files = options.copy_files.unwrap_or(true);

    let error;
    let message = match __copydir(
        Path::new(&src),
        Path::new(&dest),
        recursive,
        copy_files,
    ) {
        Ok(()) => "ok",
        Err(e) => {
            error = format!("{}", e.kind().to_string());
            &error
        }
    };

    return message.to_string();
}

// Internal implementation for copydir function
fn __copydir(src: impl AsRef<Path>, dest: impl AsRef<Path>, recursive: bool, copy_files: bool) -> io::Result<()> {
    fs::create_dir_all(&dest)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            __copydir(entry.path().to_str().unwrap().to_string(), dest.as_ref().join(entry.file_name()), recursive, copy_files)?;
        } else if copy_files {
            let dest_path = dest.as_ref().join(entry.file_name());
            if dest_path.exists() {
                if recursive {
                    fs::copy(entry.path(), dest_path)?;
                }
            } else {
                fs::copy(entry.path(), dest_path)?;
            }
        }
    }
    Ok(())
}