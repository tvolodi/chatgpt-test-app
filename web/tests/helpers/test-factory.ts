// Test data factory for creating and cleaning up test data
import { APIRequestContext } from '@playwright/test';

export interface TestArticle {
  id: string;
  title: string;
  body: string;
  status: string;
  slug?: string;
  category_id?: string | null;
  tag_ids?: string[];
}

export interface TestUser {
  id: string;
  email: string;
  name: string;
}

const API_BASE = 'http://localhost:4000/api';

export async function createTestArticle(
  request: APIRequestContext,
  overrides: Partial<TestArticle> = {}
): Promise<TestArticle> {
  const token = await getTestAuthToken(request);

  const uniqueId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const articleData = {
    title: overrides.title || `Test Article ${uniqueId}`,
    body: overrides.body || `# Test Article Content\n\nThis is a test article created for E2E testing.`,
    category_id: overrides.category_id || null,
    tag_ids: overrides.tag_ids || [],
  };

  const response = await request.post(`${API_BASE}/articles`, {
    data: articleData,
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok()) {
    throw new Error(`Failed to create test article: ${response.status()} ${response.statusText()}`);
  }

  const result = await response.json();
  return result.article;
}

export async function deleteTestArticle(request: APIRequestContext, articleId: string): Promise<void> {
  const token = await getTestAuthToken(request);

  const response = await request.delete(`${API_BASE}/articles/${articleId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Failed to delete test article: ${response.status()} ${response.statusText()}`);
  }
}

export async function getTestAuthToken(request: APIRequestContext, username: string = 'testuser', password: string = 'test123'): Promise<string> {
  const response = await request.post('http://localhost:4000/api/auth/test-token', {
    data: {
      username,
      password,
    }
  });

  if (!response.ok()) {
    throw new Error(`Failed to get auth token: ${response.status()} ${response.statusText()}`);
  }

  const result = await response.json();
  return result.token;
}

export async function cleanupTestData(request: APIRequestContext, data: { articles?: string[], categories?: string[], tags?: string[] }): Promise<void> {
  // Delete articles
  if (data.articles) {
    for (const articleId of data.articles) {
      try {
        await deleteTestArticle(request, articleId);
      } catch (error) {
        console.warn(`Failed to delete test article ${articleId}:`, error);
      }
    }
  }

  // TODO: Add cleanup for categories and tags if needed
}

export async function createPublishedTestArticle(
  request: APIRequestContext,
  overrides: Partial<TestArticle> = {}
): Promise<TestArticle> {
  const article = await createTestArticle(request, overrides);

  // Publish the article
  const token = await getTestAuthToken(request);
  const response = await request.post(`${API_BASE}/articles/${article.id}/publish`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok()) {
    throw new Error(`Failed to publish test article: ${response.status()} ${response.statusText()}`);
  }

  const result = await response.json();
  return result.article;
}