use std::{
  env::current_dir,
  process::{self, Command},
};

#[napi(object)]
pub struct ProcessResult {
  pub stdout: Option<String>,
  pub stderr: Option<String>,
  pub exit_code: Option<i32>,
  pub is_executed: bool,
}

#[napi(object)]
pub struct Options {
  pub cwd: Option<String>,
  #[napi(ts_type = "'inherit' | 'piped' | null")]
  pub stdin: Option<String>,
  #[napi(ts_type = "'inherit' | 'piped' | null")]
  pub stdout: Option<String>,
  #[napi(ts_type = "'inherit' | 'piped' | null")]
  pub stderr: Option<String>,
}

impl Default for Options {
  fn default() -> Self {
    Self {
      cwd: Some(
        current_dir()
          .unwrap_or_default()
          .into_os_string()
          .into_string()
          .unwrap(),
      ),
      stdin: Some("inherit".to_string()),
      stdout: Some("piped".to_string()),
      stderr: Some("piped".to_string()),
    }
  }
}

struct Stdio {
  stdin: process::Stdio,
  stderr: process::Stdio,
  stdout: process::Stdio,
}

impl Options {
  fn map_stdio(&self) -> Stdio {
    let match_to_stdio = |x: &str| match x {
      "inherit" => process::Stdio::inherit(),
      "piped" => process::Stdio::piped(),
      _ => process::Stdio::null(),
    };
    let stderr = match_to_stdio(self.stderr.as_ref().unwrap_or(&"piped".to_string()).as_str());
    let stdin = match_to_stdio(self.stdin.as_ref().unwrap_or(&"inherit".to_string()).as_str());
    let stdout = match_to_stdio(self.stdout.as_ref().unwrap_or(&"piped".to_string()).as_str());

    Stdio {
      stdin,
      stderr,
      stdout,
    }
  }
}

// Alias for spawn function
#[napi(
  // This is more accurate signature, unfortunately we can't do union on the struct...
  ts_return_type = "{ stdout: undefined, stderr: undefined, exitCode?: number, isExecuted: false } | { stdout: string, stderr: string, exitCode?: number, isExecuted: true }"
)]
pub fn exec(mut command_with_args: Vec<String>, options: Option<Options>) -> ProcessResult {
  let command = command_with_args.get(0).unwrap().to_string();
  command_with_args.remove(0);

  spawn(command, command_with_args, options)
}

#[napi(
  // This is more accurate signature, unfortunately we can't do union on the struct...
  ts_return_type = "{ stdout: undefined, stderr: undefined, exitCode?: number, isExecuted: false } | { stdout: string, stderr: string, exitCode?: number, isExecuted: true }"
)]
pub fn spawn(command: String, args: Vec<String>, options: Option<Options>) -> ProcessResult {
  let options = Options {
    ..options.unwrap_or_default()
  };
  let Stdio {
    stderr,
    stdin,
    stdout,
  } = options.map_stdio();
  let Options { cwd, .. } = options;
  let output = Command::new(command)
    .args(args)
    .current_dir(cwd.unwrap_or_default())
    .stdin(stdin)
    .stderr(stderr)
    .stdout(stdout)
    .output();
  
  if let Ok(output) = output {
    ProcessResult {
      stdout: Some(String::from_utf8_lossy(&output.stdout).to_string()),
      stderr: Some(String::from_utf8_lossy(&output.stderr).to_string()),
      exit_code: output.status.code(),
      is_executed: true,
    }
  } else {
    ProcessResult {
      stderr: Some(output.unwrap_err().kind().to_string()),
      stdout: None,
      exit_code: None,
      is_executed: false,
    }
  }
}

// Alias for spawn_and_dont_wait
#[napi]
pub fn exec_and_dont_wait(mut command_with_args: Vec<String>, options: Option<Options>) -> ProcessResult {
  let command = command_with_args.get(0).unwrap().to_string();
  command_with_args.remove(0);

  spawn_and_dont_wait(command, command_with_args, options)
}

#[napi]
pub fn spawn_and_dont_wait(command: String, args: Vec<String>, options: Option<Options>) -> ProcessResult {
  let options = Options {
    ..options.unwrap_or_default()
  };
  let Stdio {
    stderr,
    stdin,
    stdout,
  } = options.map_stdio();
  let Options { cwd, .. } = options;

  Command::new(command)
    .args(args)
    .current_dir(cwd.unwrap_or_default())
    .stdin(stdin)
    .stderr(stderr)
    .stdout(stdout)
    .spawn()
    .unwrap();

  ProcessResult { 
    stdout: None,
    stderr: None,
    exit_code: None,
    is_executed: true,
  }
}