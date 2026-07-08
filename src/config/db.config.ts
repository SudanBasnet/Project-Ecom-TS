import mongoose from "mongoose";

const ATLAS_FALLBACK_HOSTS = [
  "ac-pwyyh3p-shard-00-00.lmyqm5s.mongodb.net:27017",
  "ac-pwyyh3p-shard-00-01.lmyqm5s.mongodb.net:27017",
  "ac-pwyyh3p-shard-00-02.lmyqm5s.mongodb.net:27017",
].join(",");

const getAtlasFallbackUri = (dbUri: string) => {
  if (!dbUri.startsWith("mongodb+srv://")) return null;

  const url = new URL(dbUri);
  if (url.hostname !== "ecommerce.lmyqm5s.mongodb.net") return null;

  const credentials = url.username
    ? `${url.username}${url.password ? `:${url.password}` : ""}@`
    : "";

  url.searchParams.set("tls", "true");
  url.searchParams.set("authSource", "admin");
  url.searchParams.set("replicaSet", "atlas-lwqddq-shard-0");

  return `mongodb://${credentials}${ATLAS_FALLBACK_HOSTS}${url.pathname}?${url.searchParams.toString()}`;
};

const connectDatabase = async (DB_URI: string) => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database Connected");
  } catch (error) {
    const fallbackUri = getAtlasFallbackUri(DB_URI);

    if (fallbackUri && (error as { code?: string }).code === "EBADRESP") {
      console.log("Atlas SRV lookup failed. Retrying with direct hosts.");
      try {
        await mongoose.connect(fallbackUri);
        console.log("Database Connected");
        return;
      } catch (fallbackError) {
        console.log("---------------Database connection error----------");
        console.log(fallbackError);
        return;
      }
    }

    console.log("---------------Database connection error----------");
    console.log(error);
  }
};

export default connectDatabase;
