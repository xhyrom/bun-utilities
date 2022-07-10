use napi::bindgen_prelude::*;
use std::{process::Command, env, collections::HashMap};

#[napi(object)]
pub struct ExecSubProcess {
  pub status: String,
  pub output: String,
}

#[napi(object)]
pub struct ExecOptions {
  pub cwd: Option<String>,
  pub enviroment_variables: Option<HashMap<String, String>>,
}

struct InternalExecOptions {
  pub cwd: String,
  pub enviroment_variables: HashMap<String, String>,
}

#[napi]
async fn exec(mut command_with_args: Vec<String>, options: Option<ExecOptions>) -> Result<ExecSubProcess> {
  let command = command_with_args.get(0).unwrap().to_string();
  command_with_args.remove(0);

  let unwrapped_options = options.unwrap_or(
    ExecOptions {
        cwd: None,
        enviroment_variables: None,
    }
);

  __exec(
    command,
    command_with_args,
    InternalExecOptions {
      cwd: unwrapped_options.cwd.unwrap_or(env::current_dir().unwrap().into_os_string().into_string().unwrap()),
      enviroment_variables: unwrapped_options.enviroment_variables.unwrap_or(HashMap::new())
    }
  )
  .await
}

async fn __exec(command: String, args: Vec<String>, options: InternalExecOptions) -> Result<ExecSubProcess> {
  let mut command_process = Command::new(command);
  command_process.args(args).current_dir(options.cwd).envs(options.enviroment_variables);

  Ok(ExecSubProcess {
    status: command_process.status().expect("Error").to_string(),
    output: String::from_utf8_lossy(&command_process.output().expect("error").stdout).to_string()
  })
}