// This file simulates a backend API for demonstration purposes

export const generateSummary = async (events: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate a mock summary based on the number of events
  const eventCount = events.split('.').length;
  return `You have ${eventCount} event${eventCount !== 1 ? 's' : ''} scheduled. ${
    eventCount > 0
      ? "It looks like you have a busy schedule ahead. Make sure to allocate enough time for rest and personal activities between your commitments."
      : "Your schedule is clear. Consider planning some activities or using this time for personal development."
  }`;
};