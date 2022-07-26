const fs = require("fs");
const path = require("path");

import type { VariableCollection, VariableParam } from "./types";

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
    "dark",
    "darkest",
    "light",
    "lightest",
    "gradient",
    "ILST",
    "AEFT",
    "DRWV",
    "FLPR",
    "IDSN",
    "PHXS",
    "PPRO",
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

const runTest = async (param: string) => {
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
