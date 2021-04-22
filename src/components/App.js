import { CardUI } from "./CardUI";
import { makeStyles } from "@material-ui/core/styles"
import {
    Container,
    CssBaseline,
    Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        height: "100vh",
    },
    grid: {
        height: "100%",
    }
}));

function App() {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Container maxWidth="sm" className={classes.container}>
                <Grid container alignItems="center" className={classes.grid}>
                    <Grid item xs>
                        <CardUI />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default App;
