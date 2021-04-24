import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    IconButton,
} from "@material-ui/core";
import { 
    SentimentSatisfiedAlt as LikeIcon,
    SentimentDissatisfied as SkipIcon, 
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    controller: {
        "& > *": {
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        }
    },
    button: {
        border: "1px solid " + theme.palette.grey[400]
    },
}));

/**
 * 仕分け用コントローラー
 * 
 * @param {Function} props.onSkip スキップボタンをクリックした時に呼び出すイベントハンドラー
 * @param {Function} props.onLike いいねボタンをクリックした時に呼び出すイベントハンドラー
 */
export function Controller({onSkip, onLike}) {
    const classes = useStyles();

    const icons = [
        {
            component: <SkipIcon fontSize="large" color="error" />,
            onClick: onSkip
        },
        {
            component: <LikeIcon fontSize="large" color="primary" />,
            onClick: onLike
        }
    ];

    return (
        <Grid container justify="center">
            <Grid item className={classes.controller}>
                {icons.map((icon, i) => (
                    <IconButton
                        className={classes.button}
                        onClick={icon.onClick}  
                        key={i}
                    >
                        {icon.component}
                    </IconButton>
                ))}
            </Grid>
        </Grid>
    );
}