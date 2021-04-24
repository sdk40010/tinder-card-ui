import {useEffect } from "react";
import { NavBar } from "./NavBar";
import { MainContainer } from "./MainContainer";
import { CardUI } from "./card-ui/CardUI";
import { config } from "../config";
import { usePersonAPI } from "../hooks/personAPI";
import { CssBaseline　} from "@material-ui/core";

function App() {
    const personAPI = usePersonAPI();

    // 人物一覧を取得する
    useEffect(() => {
        (async () => {
            await personAPI.getAll({ results: config.RESULT_COUNT })
        })();
    }, []);

    return (
        <>
            <CssBaseline />
            <NavBar />
            <MainContainer
                errors={[personAPI.error]}
                resources={[personAPI.data]}
            >
                <CardUI people={personAPI.data} />
            </MainContainer>
            
        </>
    );
}

export default App;
