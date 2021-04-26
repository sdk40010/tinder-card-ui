import { useState, useMemo } from "react";
import { config } from "../config";

/**
 * 人物に関するAPI用のフック
 */
export　function usePersonAPI() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * 人物一覧を取得する
     * 
     * @param {Object} query クエリパラメータ
     * @returns {array} 人物の配列
     */
    const getAll = async (query = {}) => {
        try {
            const params = new URLSearchParams(query);
            const queryString = params.toString() ? `?${params.toString()}` : "";

            const people = (await apiCall(config.API_URL + queryString, "GET")).results;
            setData(people);

            return people;
        } catch (err) {
            setError(err);
        }
    }

    return useMemo(() => 
        ({
            data,
            error,
            getAll
        }), 
        [data, error]
    );
}

/**
 * APIサーバーにリクエストを送る
 * 
 * @param {string} url APIのURL
 * @param {string} method HTTPメソッド
 * @returns {Object} JSONレスポンス
 * @throws {Error} エラーレスポンス
 */
async function apiCall(url, method) {
    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (res.ok) {
        return await res.json();
    } else {
        handleError(res);
    }
}

/**
 * HTTPステータスコードに応じてエラーを投げる
 * 
 * @param {Response} res リクエストのレスポンス
 */
function handleError (res) {
    switch (res.status) {
      case 400: throw new Error("Bad Request");
      case 401: throw new Error("Unauthorized");
      case 403: throw new Error("Forbidden");
      case 404: throw new Error("Not Found");
      case 500: throw new Error("Internal Server Error");
      case 502: throw new Error("Bad Gateway");
      default:  throw new Error("Unhandled Error");
    } 
};