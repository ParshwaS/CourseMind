/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: true
			},
		],
	},
	testEnvironment: "node",
	testMatch: ["**/__tests__/**/*.test.ts"],
};
