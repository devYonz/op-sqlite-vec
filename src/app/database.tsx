import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { sql } from "drizzle-orm";
import { drizzle, OPSQLiteDatabase } from "drizzle-orm/op-sqlite";
import { migrate } from "drizzle-orm/op-sqlite/migrator";
import { open } from "@op-engineering/op-sqlite";
import * as FileSystem from "expo-file-system";

import { user } from "src/db/schema/users";
import migrations from "src/db/drizzle/migrations";
const DB_NAME = "drizzle.db";

const now = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const opsqlite = open({
  name: DB_NAME,
});
const db = drizzle(opsqlite);
export default function Database() {
  const [dbStatus, setDbStatus] = useState<string>("Waiting for database...");
  const [users, setUsers] = useState<any[]>([]);
  const [embedResults, setEmbedResults] = useState<any[]>([]);

  const initDatabase = async () => {
    try {
      // 1. Check if the database file exists
      const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
      const fileInfo = await FileSystem.getInfoAsync(dbPath);

      console.log(`${now()} Checking for database file...`);
      if (fileInfo.exists) {
        console.log(`${now()} Database file found.`);
      } else {
        console.log(`${now()} Database file not found. It will be created.`);
      }

      // 2. Verify SQLite is working
      console.log(`${now()} Verifying SQLite...`);
      const result = await db.get(sql`SELECT 1 AS value`);
      if (result) {
        console.log(`${now()} SQLite is working correctly, SELECT 1 returned`, result);
        console.log(`${now()} Value returned =  ${result?.value}`);
      }

      // 3. Select users if the table exists
      console.log(`${now()} Checking for users table...`);
      try {
        const users = await db.select().from(user).all();
        console.log(`${now()} Users found:`, users);
        setUsers(users);
      } catch (error) {
        console.log(`${now()} Users table doesn't exist yet.`);
      }

      // 4. Run migrations
      console.log(`${now()} Running migrations...`);
      await migrate(db, migrations);
      console.log(`${now()} Migrations completed.`);

      setDbStatus("Database initialized successfully");
    } catch (error) {
      console.error(`${now()} Error in database initialization:`, error);
      setDbStatus(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    initDatabase();
  }, []);

  const addMockUsers = async () => {
    console.log("Adding mock users");
    await db.insert(user).values([
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Doe", email: "jane@example.com" },
    ]);
    setUsers(await db.select().from(user).all());
  };

  const addEmbeddingValues = async () => {
    console.log(`${now()} Adding embedding values using direct sql`);
    const createVirtualTable = await db.run(sql`
      CREATE VIRTUAL TABLE IF NOT EXISTS vec_items USING vec0(embedding float[4]);
    `);

    const items = [
      [1, [0.1, 0.1, 0.1, 0.1]],
      [2, [0.2, 0.2, 0.2, 0.2]],
      [3, [0.3, 0.3, 0.3, 0.3]],
      [4, [0.4, 0.4, 0.4, 0.4]],
      [5, [0.5, 0.5, 0.5, 0.5]],
    ];
    for (const [rowid, embedding] of items) {
      await db.run(sql`
        INSERT INTO vec_items(embedding)
        VALUES (${JSON.stringify(embedding)})
      `);
    }
    // try {
    //   await db.insert(vecItems).values(items);
    //   console.log("Batch insert completed successfully");
    // } catch (error) {
    //   console.error("Error during batch insert:", error);
    // }

    const searchEmbedding = [0.3, 0.3, 0.3, 0.3];

    const result = await db.run(sql`
      SELECT rowid, distance
      FROM vec_items
      WHERE embedding MATCH ${JSON.stringify(searchEmbedding)}
      ORDER BY distance
      LIMIT 3
    `);

    console.log(`${now()} Query result for searchEmbedding[.3 .3 .3 .3]:`, result);
    setEmbedResults(result?.res);
  };

  return (
    <View style={{ flex: 1 }}>
      <View className='p-4 bg-slate-200'>
        <Text className='text-2xl w-full text-center font-bold'>Database Playground</Text>
      </View>
      <View className='flex-1 p-2 bg-indigo-300'>
        <Text className='text-xl'>{dbStatus}</Text>
        <Text className='text-lg'>Users:</Text>

        <View className='p-2 bg-slate-200 min-h-1'>
          {users.length == 0 && (
            <View className='flex-row justify-between'>
              <Text>No users found</Text>
              <Pressable onPress={() => addMockUsers()}>
                <Text>Add Users</Text>
              </Pressable>
            </View>
          )}
          {users.map((user, index) => (
            <Text key={index}>{JSON.stringify(user)}</Text>
          ))}
        </View>
        <Pressable onPress={() => addMockUsers()}>
          <Text>Add Mock Users</Text>
        </Pressable>
        <View className='mt-4'>
          <Text className='text-lg'>Embeddings:</Text>
          <View className='p-2 bg-slate-200 min-h-1'>
            <View className='flex-row justify-between'>
              <Text>Test vector embeddings</Text>
              <Pressable onPress={() => addEmbeddingValues()}>
                <Text>Run Embedding Test</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
