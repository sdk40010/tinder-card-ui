import { CardUI } from "./CardUI";
import { makeStyles } from "@material-ui/core/styles"
import {
    Container,
    CssBaseline,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        height: "100vh",
    },
    grid: {
        height: "100%",
    },
}));

function App() {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Container maxWidth="sm" className={classes.container}>
                <CardUI />
            </Container>
        </>
    );
}

export default App;
