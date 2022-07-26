const fs = require("fs");
const path = require("path");
const maskSchema = require("./mask.json");

import type {
  VariableCollection,
  VariableParam,
  MaskCollection,
  MaskItem,
} from "./types";

const readFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (fs.readFile)
      fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    else {
      resolve(fs.readFileSync(filePath, "utf-8"));
    }
  });
};
const decodeKeys = (data: VariableCollection) => {
  const allKeys = data
    .map((a: VariableParam) => Object.keys(a))
    .flat()
    .filter((v: any, i: number, a: any) => a.indexOf(v) == i)
    .sort()
    .map((v: any) => {
      return {
        key: v,
        mask: null,
      };
    });
  const sorted = data
    .sort((a: VariableParam, b: VariableParam) =>
      a.title.localeCompare(b.title)
    )
    .map((a: VariableParam) => {
      return {
        key: a.title,
        mask: null,
      };
    });
  const parentKeys = [
    "ILST",
    "AEFT",
    "DRWV",
    "FLPR",
    "IDSN",
    "PHXS",
    "PPRO",
    "AUDT",
    "dark",
    "darkest",
    "light",
    "lightest",
    "gradient",
  ].map((i) => {
    return {
      key: i,
      mask: null,
    };
  });
  const masterList = [...parentKeys, allKeys, sorted].flat();
  masterList.forEach((entry: any, index: number) => {
    entry.mask = decodeWriter(index);
  });
  return masterList;
};

const decodeWriter = (index: number) => {
  const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  try {
    if (index < alpha.length) return alpha[index];
    else {
      let dividend = Math.floor(index / alpha.length);
      return `${decodeWriter(dividend - 1)}${decodeWriter(
        index % alpha.length
      )}`;
    }
  } catch (err) {
    console.error(
      `Errored at ${index} => ${alpha.length >= index ? alpha[index] : index}`
    );
  }
};

const readDir = async (targetPath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (
      !fs.existsSync(path.resolve(targetPath)) ||
      !fs.lstatSync(path.resolve(targetPath)).isDirectory()
    )
      reject("Path is not a folder or does not exist");
    fs.readdir(
      path.resolve(targetPath),
      { encoding: "utf-8" },
      (err, files) => {
        if (err) reject(err);
        resolve(files);
      }
    );
  });
};

const runMaskGenerationTest = async () => {
  let basePath = "./stylesheets/ILST/dark.json";
  let fileData = JSON.parse(
    await readFile(path.resolve(basePath))
  ) as VariableCollection;
  let result = decodeKeys(fileData);
  let treated = fs.writeFileSync(
    path.resolve("./mask.json"),
    JSON.stringify(result)
  );
  console.log("Done");
};

const runConversionTest = async () => {
  let basePath = "./stylesheets";
  let apps = await readDir(basePath);
  let maskedData = {};
  let rawData = {};
  for (let app of apps) {
    rawData[app] = {};
    maskedData[lookupEncode(app)] = {};
    let sheets = await readDir(`${basePath}/${app}`);
    for (let sheet of sheets) {
      sheet = sheet.replace(/\.json$/, "");
      rawData[app][sheet] = [];
      maskedData[lookupEncode(app)][lookupEncode(sheet)] = [];
      let fileData = JSON.parse(
        await readFile(`${basePath}/${app}/${sheet}.json`)
      ) as VariableCollection;
      let maskList = maskedData[lookupEncode(app)][lookupEncode(sheet)],
        rawList = rawData[app][sheet];
      for (let variable of fileData) {
        rawList.push(variable);
        let temp = {};
        Object.keys(variable).forEach((key) => {
          temp[lookupEncode(key)] =
            key == "title"
              ? lookupEncode(variable[key], app + sheet)
              : variable[key];
        });
        maskList.push(temp);
      }
    }
  }
  fs.writeFileSync(path.resolve("./resultRaw.json"), JSON.stringify(rawData));
  fs.writeFileSync(
    path.resolve("./resultMask.json"),
    JSON.stringify(maskedData)
  );
};

const lookupEncode = (key: string, debugInfo?: string) => {
  try {
    return maskSchema.find((maskItem: MaskItem): boolean => maskItem.key == key)
      .mask;
  } catch (err) {
    console.error(`Could not find key of ${key}`, debugInfo);
  }
};

const lookupDecode = (mask: string): string => {
  return maskSchema.find((maskItem: MaskItem): boolean => maskItem.mask == mask)
    .key;
};

// runMaskGenerationTest();
runConversionTest();
