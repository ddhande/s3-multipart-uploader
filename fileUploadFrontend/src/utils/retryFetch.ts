export const retryFetch = async (
    url: string,
    options: RequestInit,
    retries = 3,
    delay = 1000
  ): Promise<Response> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return response; // Successfully return the response
      } catch (error) {
        if (attempt === retries) {
          throw error; // Rethrow error if all retries are exhausted
        }
        await new Promise((resolve) => setTimeout(resolve, attempt * delay)); // Exponential delay
      }
    }
    throw new Error("Retry fetch failed unexpectedly"); // This line ensures all code paths have a return
  };
  