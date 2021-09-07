import { describe, test, expect, jest } from "@jest/globals";
import fs from "fs";
import FileHelper from "../../src/fileHelper.js";
import Routes from "../../src/routes.js";

describe("#FileHelper ", () => {
  describe("#getFileStatus", () => {
    test("it should return files statuses in correct format", async () => {
      const statMock = {
        dev: 3458047403,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 23643898043800970,
        size: 3216204,
        blocks: 6288,
        atimeMs: 1631043261265.6252,
        mtimeMs: 1629847893155.0083,
        ctimeMs: 1629847908671.0017,
        birthtimeMs: 1631043261004.6228,
        atime: "2021-09-07T19:34:21.266Z",
        mtime: "2021-08-24T23:31:33.155Z",
        ctime: "2021-08-24T23:31:48.671Z",
        birthtime: "2021-09-07T19:34:21.005Z",
      };

      const mockUser = "guilherme";
      process.env.USER = mockUser;
      const filename = "file.png";
      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename]);

        const result = await FileHelper.getFilesStatus("/tmp")

      const expectedResult = [
        {
          size: '3.22 MB',
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
      expect(result).toMatchObject(expectedResult)
    });
  });
});
