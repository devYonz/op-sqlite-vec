import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { drizzle, OPSQLiteDatabase } from "drizzle-orm/op-sqlite";
import { open } from "@op-engineering/op-sqlite";

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
  useEffect(() => {
    const runops = async () => {
      console.log(`${now()} Migrations started!`);
      migrate(db, { migrationsFolder: "drizzle" });

      // const result = await db.select().from(users);
      console.log(result);
    };
    runops();
  }, []);

  return (
    <View className='flex-1'>
      <View className='p-4 bg-slate-200'>
        <Text className='text-2xl w-full text-center font-bold'>Database Playground</Text>
      </View>
      <View className='flex-1 items-center justify-center bg-indigo-300'></View>
    </View>
  );
}
function migrate(db: OPSQLiteDatabase<Record<string, never>>, arg1: { migrationsFolder: string }) {
  throw new Error("Function not implemented.");
}
