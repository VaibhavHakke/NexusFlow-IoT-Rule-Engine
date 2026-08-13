const db = require("../config/database");

// Create devices table
db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'offline',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Get all devices
function getAllDevices() {
    return db
        .prepare("SELECT * FROM devices ORDER BY id")
        .all();
}

// Get one device
function getDeviceById(id) {
    return db
        .prepare("SELECT * FROM devices WHERE id = ?")
        .get(id);
}

// Create device
function createDevice(name, type) {
    const result = db
        .prepare(`
            INSERT INTO devices (name, type, status)
            VALUES (?, ?, 'offline')
        `)
        .run(name, type);

    return getDeviceById(result.lastInsertRowid);
}

// Update device
function updateDevice(id, name, type, status) {
    const result = db
        .prepare(`
            UPDATE devices
            SET name = ?, type = ?, status = ?
            WHERE id = ?
        `)
        .run(name, type, status, id);

    if (result.changes === 0) {
        return null;
    }

    return getDeviceById(id);
}

// Delete device
function deleteDevice(id) {
    const result = db
        .prepare("DELETE FROM devices WHERE id = ?")
        .run(id);

    return result.changes > 0;
}

module.exports = {
    getAllDevices,
    getDeviceById,
    createDevice,
    updateDevice,
    deleteDevice
};