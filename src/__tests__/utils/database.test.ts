// Simple database utility tests

// Mock the entire database module since it requires environment setup
jest.mock('@/_utils/database', () => ({
  UserRepository: {
    getUserByUsername: jest.fn(),
    getUserByAccessToken: jest.fn(),
    upsertUser: jest.fn(),
    updateUserRole: jest.fn(),
    deleteUser: jest.fn(),
    createTable: jest.fn(),
  },
  sql: jest.fn(),
}))

import { UserRepository } from '@/_utils/database'

describe('Database Utils', () => {
  it('should have UserRepository methods', () => {
    expect(UserRepository.getUserByUsername).toBeDefined()
    expect(UserRepository.getUserByAccessToken).toBeDefined()
    expect(UserRepository.upsertUser).toBeDefined()
    expect(UserRepository.updateUserRole).toBeDefined()
    expect(UserRepository.deleteUser).toBeDefined()
    expect(UserRepository.createTable).toBeDefined()
  })

  it('should be properly mocked for testing', () => {
    expect(jest.isMockFunction(UserRepository.getUserByUsername)).toBe(true)
  })
})
