export const timestampToDate = (timestamp: number) => {
  // Create a new Date object from the timestamp
  return new Date(timestamp);
}

// get current date and time, convert to timestamp
export const getCurrentTimestamp = () => {
  // Get the current date and time
  const now = new Date();
  // Convert the current date and time to a timestamp
  return now.getTime();
}

// check if a timestamp is in the past
export const isTimestampInPast = (timestamp: number) => {
  // Get the current timestamp
  const currentTimestamp = getCurrentTimestamp();
  // Check if the timestamp is in the past
  return timestamp < currentTimestamp;
}