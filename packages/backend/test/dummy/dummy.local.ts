import { describe, expect, it } from 'vitest';

// Import the function you want to test

describe('Addition', () => {
	it('should return the sum of two numbers', () => {
		// Call the function you want to test
		const result = 1 + 1;

		// Use the expect function to make assertions
		expect(result).toBe(2);
	});
});
