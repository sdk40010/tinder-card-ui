import { NavBar } from "./NavBar";
import { CardUI } from "./CardUI";
import { makeStyles } from "@material-ui/core/styles"
import {
    Container,
    CssBaseline,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        height: "calc(100vh - 56px)", 
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: { 
            height: "calc(100vh - 46px)", 
        }, 
        [theme.breakpoints.up('sm')]: { 
            height: "calc(100vh - 64px)", 
        },
        padding: theme.spacing(4)
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
            <NavBar />
            <main>
                <Container maxWidth="sm" className={classes.container}>
                    <CardUI />
                </Container>
            </main>
            
        </>
    );
}

export default App;
