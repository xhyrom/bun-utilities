use std::process::Command;

#[napi(object)]
pub struct ProcessResult {
  pub stdout: Option<String>,
  pub stderr: Option<String>,
  pub exit_code: Option<i32>,
  pub is_executed: bool,
}

#[napi(
  // This is more accurate signature, unfortunately we can't do union on the struct...
  ts_return_type = "Promise<{ stdout: undefined, stderr: undefined, exitCode?: number, isExecuted: false } | { stdout: string, stderr: string, exitCode?: number, isExecuted: true }>"
)]
async fn spawn(command: String, cwd: String, args: Vec<String>) -> ProcessResult {
  let output = Command::new(command).args(args).current_dir(cwd).output();

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
