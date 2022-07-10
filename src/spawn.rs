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
    let stderr = match_to_stdio(self.stderr.as_ref().unwrap_or(&String::default()).as_str());
    let stdin = match_to_stdio(self.stdin.as_ref().unwrap_or(&String::default()).as_str());
    let stdout = match_to_stdio(self.stdout.as_ref().unwrap_or(&String::default()).as_str());

    Stdio {
      stdin,
      stderr,
      stdout,
    }
  }
}

#[napi(
  // This is more accurate signature, unfortunately we can't do union on the struct...
  ts_return_type = "Promise<{ stdout: undefined, stderr: undefined, exitCode?: number, isExecuted: false } | { stdout: string, stderr: string, exitCode?: number, isExecuted: true }>"
)]
async fn spawn(command: String, args: Vec<String>, options: Option<Options>) -> ProcessResult {
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
      stderr: None,
      stdout: None,
      exit_code: None,
      is_executed: false,
    }
  }
}