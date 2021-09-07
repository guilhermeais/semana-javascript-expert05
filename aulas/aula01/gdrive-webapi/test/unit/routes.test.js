import { describe, test, expect, jest } from "@jest/globals";
import Routes from "../../src/routes.js";

describe("#Routes test suite ", () => {
    const deafultParams = {
        request: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          method: "",
          body: {},
        },
        response: {
          setHeader: jest.fn(),
          writeHead: jest.fn(),
          end: jest.fn(),
        },
        values: () => Object.values(deafultParams),
      };
  describe("#setSocketInstance", () => {
    test("setSocket should store io instance", () => {
      const routes = new Routes();
      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {},
      }; // simulamos o obj de instancia de um socket

      routes.setSocketInstance(ioObj);
      expect(routes.io).toStrictEqual(ioObj); // comparamos se o tipo e estrutura do ioObj, é igual ao routes.io, que "salvou" a instãncia do nosso ioObj
    });
  });
  describe("#handler", () => {
    
    test("given an inexistent route it should choose default route", async () => {
      const routes = new Routes();
      const params = {
        ...deafultParams,
      };

      params.request.method = "inexistent";
      await routes.handler(...params.values());
      expect(params.response.end).toHaveBeenCalledWith("Hello world!");
    });
    test("it should set any request with CORS enabled", async () => {
      const routes = new Routes();
      const params = {
        ...deafultParams,
      };

      params.request.method = "inexistent";
      await routes.handler(...params.values());
      expect(params.response.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "*"
      );
    });
    test("given method OPTIONS it should choose options route", async () => {
      const routes = new Routes();
      const params = {
        ...deafultParams,
      };

      params.request.method = "options";
      await routes.handler(...params.values());
      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });
    test("given method POST it should choose post route", async () => {
      const routes = new Routes();
      const params = {
        ...deafultParams,
      };

      params.request.method = "POST";
      jest.spyOn(routes, routes.post.name).mockResolvedValue();
      await routes.handler(...params.values());
      expect(routes.post).toHaveBeenCalled();
    });
    test("given method GET it should choose get route", async () => {
      const routes = new Routes();
      const params = {
        ...deafultParams,
      };

      params.request.method = "GET";
      jest.spyOn(routes, routes.get.name).mockResolvedValue();
      await routes.handler(...params.values());
      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe("#get", () => {
    test("given method GET it should list all files downloaded", async() => {
        const routes = new Routes()
        const params = {
            ...deafultParams
        }
        const filesStatusesMock = [
            {
              size: '3.22 MB',
              lastModified: "2021-09-07T19:34:21.005Z",
              owner: 'guilherme',
              file: 'file.pdf',
            },
        ]
        jest.spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name).mockResolvedValue(filesStatusesMock)
        params.request.method = 'GET'
        await routes.handler(...params.values())

        expect(params.response.writeHead).toHaveBeenCalledWith(200)
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock))
        

    });
  });
});
