use std::{path::Path, fs};

#[napi(object)]
pub struct RmDirOptions {
    pub recursive: Option<bool>
}

#[napi]
pub fn rmdir(path: String, options: Option<RmDirOptions>) -> () {
    let options = options.unwrap_or(RmDirOptions {
        recursive: Some(false)
    });

    let recursive = options.recursive.unwrap_or(false);

    if Path::new(&path).exists() {
        if recursive {
            fs::remove_dir_all(path).expect("can't remove directory");
            return ();
        } else {
            fs::remove_dir(path).expect("can't remove directory");
            return ();
        }
    }
}