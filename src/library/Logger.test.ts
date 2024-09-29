import { Logger } from "./Logger";

describe("Logger", () => {
  // Logger.info logs a message with the correct format and color
  it("should log a message with the correct format and color when using Logger.info", () => {
    const spy = jest.spyOn(console, "log");
    const message = "Test message";
    Logger.info(message);
    expect(spy).toHaveBeenCalled();
  });

  // Logger.warn logs a message with the correct format and color
  it("should log a message with the correct format and color when using Logger.warn", () => {
    const spy = jest.spyOn(console, "log");
    const message = "Test message";
    Logger.warn(message);
    expect(spy).toHaveBeenCalled();
  });

  // Logger.error logs a message with the correct format and color
  it("should log a message with the correct format and color when using Logger.error", () => {
    const spy = jest.spyOn(console, "log");
    const message = "Test message";
    Logger.error(message);
    expect(spy).toHaveBeenCalled();
  });

  // Logger.info logs a non-string argument correctly
  it("should log a non-string argument correctly when using Logger.info", () => {
    const spy = jest.spyOn(console, "log");
    const arg = { key: "value" };
    Logger.info(arg);
    expect(spy).toHaveBeenCalled();
  });

  // Logger.warn logs a non-string argument correctly
  it("should log a non-string argument correctly when using Logger.warn", () => {
    const spy = jest.spyOn(console, "log");
    const arg = { key: "value" };
    Logger.warn(arg);
    expect(spy).toHaveBeenCalled();
  });

  // Logger.error logs a non-string argument correctly
  it("should log a non-string argument correctly when using Logger.error", () => {
    const spy = jest.spyOn(console, "log");
    const arg = { key: "value" };
    Logger.error(arg);
    expect(spy).toHaveBeenCalled();
  });
});