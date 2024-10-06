import { openDB, IDBPDatabase } from 'idb'

const DB_NAME = 'StudentTrackingDB'
const DB_VERSION = 1

export async function initDB() {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('students')) {
          db.createObjectStore('students', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('routes')) {
          db.createObjectStore('routes', { keyPath: 'id' })
        }
      },
    })

    await loadInitialData(db, 'students')
    await loadInitialData(db, 'routes')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function loadInitialData(db: IDBPDatabase, storeName: string) {
  try {
    const response = await fetch(`/indexedDbData/${storeName}.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)

    for (const item of data) {
      await store.put(item)
    }

    await tx.done
  } catch (error) {
    console.error(`Error loading initial data for ${storeName}:`, error)
    throw new Error(`Failed to load initial data for ${storeName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getAll(storeName: string) {
  try {
    const db = await openDB(DB_NAME, DB_VERSION)
    return db.getAll(storeName)
  } catch (error) {
    console.error(`Error getting all items from ${storeName}:`, error)
    throw new Error(`Failed to get all items from ${storeName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function get(storeName: string, id: string) {
  try {
    const db = await openDB(DB_NAME, DB_VERSION)
    const item = await db.get(storeName, id)
    if (!item) {
      throw new Error(`Item with id ${id} not found in ${storeName}`)
    }
    return item
  } catch (error) {
    console.error(`Error getting item from ${storeName}:`, error)
    throw new Error(`Failed to get item from ${storeName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function add(storeName: string, item: any) {
  try {
    const db = await openDB(DB_NAME, DB_VERSION)
    return db.add(storeName, item)
  } catch (error) {
    console.error(`Error adding item to ${storeName}:`, error)
    throw new Error(`Failed to add item to ${storeName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function update(storeName: string, item: any) {
  try {
    const db = await openDB(DB_NAME, DB_VERSION)
    const existingItem = await db.get(storeName, item.id)
    if (!existingItem) {
      throw new Error(`Item with id ${item.id} not found in ${storeName}`)
    }
    return db.put(storeName, item)
  } catch (error) {
    console.error(`Error updating item in ${storeName}:`, error)
    throw new Error(`Failed to update item in ${storeName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function remove(storeName: string, id: string) {
  try {
    const db = await openDB(DB_NAME, DB_VERSION)
    return db.delete(storeName, id)
  } catch (error) {
    console.error(`Error removing item from ${storeName}:`, error)
    throw new Error(`Failed to remove item from ${storeName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}