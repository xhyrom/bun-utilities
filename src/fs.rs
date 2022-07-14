use std::{path::Path, fs};

#[napi(object)]
pub struct RmDirOptions {
    pub recursive: Option<bool>
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