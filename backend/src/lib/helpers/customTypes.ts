import { Page, BrowserContext } from "puppeteer";

interface UserToken {
	userId: string;
	accessToken: string;
}

interface BrowserBundle {
	page: Page;
	context: BrowserContext;
	index?: string;
	owner?: string;
}

export { UserToken, BrowserBundle };
