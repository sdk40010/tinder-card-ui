import { useState } from "react";
import { people as peopleData } from "./people";
import { makeStyles } from "@material-ui/core/styles"
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
} from "@material-ui/core";
import { 
    SentimentSatisfiedAlt as LikeIcon,
    SentimentDissatisfied as SkipIcon, 
} from "@material-ui/icons";


const centering = {
    top: "50% ",
    left: "50% ",
    transform: "translateY(-50%) translateX(-50%) ",
};

const useStyles = makeStyles((theme) => ({
    wrapper: {
        height: "100%"
    },
    cards: {
        position: "relative",
        height: "80%"
    },
    actions: {
        height: "20%"
    },
    card: {
        width: "100%",
        position: "absolute",
        ...centering,
        "&:nth-child(1)": {
            zIndex: 5,
        },
        "&:nth-child(2)": {
            zIndex: 4,
            top: `calc(${centering.top + "+ 10px"})`,
            transform: centering.transform + "scale(0.98)",
        },
        "&:nth-child(3)": {
            zIndex: 3,
            top: `calc(${centering.top + "+ 20px"})`,
            transform: centering.transform + "scale(0.96)",
        },
        "&:nth-child(n+4)": {
            zIndex: 2,
            transform: centering.transform + "scale(0.7)",
        },
        "&::before": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
            content: '""',
        }
    },
    image: {
        paddingTop: "100%",
    },
    cardContent: {
        "& > *:not(:last-child)": {
            marginRight: theme.spacing(1)
        }
    },
    actionButtons: {
        "& > *": {
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        }
    },
    actionButton: {
        border: "1px solid " + theme.palette.grey[400]
    }
}));

export function CardUI() {
    const classes = useStyles();

    const [people, setPeople] = useState(peopleData);
    const [liked, setLiked] = useState([]);
    const [skiped, setSkiped] = useState([]);

    const handleSkip = () => {
        setPeople(people.slice(1));
        setSkiped(people.slice(0, 1));
    }

    const handleLike = () => {
        setPeople(people.slice(1));
        setLiked(people.slice(0, 1));
    };

    return (
        <Box className={classes.wrapper}>

            <Box className={classes.cards}>
                {people.map(person => (
                    <Card className={classes.card}>
                        <CardMedia
                            image={person.img}
                            title={person.name}
                            className={classes.image}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography variant="h6" component="span" >
                                {person.name}
                            </Typography>
                            <Typography color="textSecondary" component="span">
                                {person.age}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box className={classes.actions}>
                <CardUIActions />
            </Box>
        </Box>
    );
}

function CardUIActions() {
    const classes = useStyles();

    const icons = [
        <SkipIcon fontSize="large" color="error" />,
        <LikeIcon fontSize="large" color="primary" />
    ];

    return (
        <Grid container justify="center">
            <Grid item className={classes.actionButtons}>
                {icons.map(icon => (
                    <IconButton className={classes.actionButton}>
                        {icon}
                    </IconButton>
                ))}
            </Grid>
        </Grid>
    );
}