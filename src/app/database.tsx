import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { drizzle, OPSQLiteDatabase } from "drizzle-orm/op-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";

import { open } from "@op-engineering/op-sqlite";
import { user } from "@/db/schema";

const now = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const opsqlite = open({
  name: "drizzle.db",
});
const db = drizzle(opsqlite);

export default function Database() {
  const [users, setUsers] = React.useState([]);

  const loadUsers = async () => {
    const users = await db.select().from(user);
    console.log(`${now()} Users fetched:`, users);
    setUsers(users);
  };
  useEffect(() => {
    const initDatabase = async () => {
      console.log(`${now()} Database migrtion started!`);
      try {
        await migrate(db, { migrationsFolder: "src/db/drizzle" });
        console.log(`${now()} Migrations completed successfully!`);
      } catch (error) {
        console.error(`${now()} Error in database migrtion:`, error);
      }
    };
    initDatabase();
  }, []);

  return (
    <View className='flex-1'>
      <View className='p-4 bg-slate-200'>
        <Text className='text-2xl w-full text-center font-bold'>Database Playground</Text>
      </View>

      <View className='flex-1 items-center justify-center bg-indigo-300'>
        <View className='flex-1 flex-row'>
          <Text>Database Playground</Text>
          <Pressable>
            <Text>Load Users</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
