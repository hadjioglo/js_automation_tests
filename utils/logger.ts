export class Logger {
  private className: string;

  constructor(className: string) {
    this.className = className;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.className}] ${message}`;
  }

  info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }

  error(message: string): void {
    console.error(this.formatMessage('ERROR', message));
  }

  debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }

  step(message: string): void {
    console.log(this.formatMessage('STEP', `🔹 ${message}`));
  }

  success(message: string): void {
    console.log(this.formatMessage('SUCCESS', `✅ ${message}`));
  }

  failure(message: string): void {
    console.log(this.formatMessage('FAILURE', `❌ ${message}`));
  }
}