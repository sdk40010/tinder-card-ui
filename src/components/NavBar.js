import {
    AppBar,
    Toolbar,
    Typography,
} from "@material-ui/core";

export function NavBar() {
    return (
        <>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6">Tinder Card UI</Typography>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
}