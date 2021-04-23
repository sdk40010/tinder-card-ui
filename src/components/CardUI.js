import { useState, useCallback } from "react";
import { people as peopleData } from "./people";
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx";
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

// カードラッパー用
const CARD_MAX_WIDTH = "500px";
const CARD_CONTENT_HEIGHT = "72px"
const CARD_TOP_DIFF = "10px";

// カードアニメーション用
const OFF_SCREEN = "400px";

const useStyles = makeStyles((theme) => ({
    // ラッパー
    wrapper: {
        height: "100%"
    },
    cards: {
        position: "relative",
        maxWidth: CARD_MAX_WIDTH,
        margin: "0 auto",
        "&::before": { // カードラッパーの高さ調整用
            content: '""',
            display: "block",
            paddingTop: `calc(100% + ${CARD_CONTENT_HEIGHT} + calc(${CARD_TOP_DIFF} * 2))`,
        },
    },
    doneMessage: {
        minHeight: "100%",
        textAlign: "center"
    },

    // 人物カード
    card: {
        width: "100%",
        maxWidth: "500px",
        position: "absolute",
        transition: "all .1s linear",
        top: 0,
        "&:nth-child(1)": {
            zIndex: 5,
        },
        "&:nth-child(2)": {
            zIndex: 4,
            top: CARD_TOP_DIFF,
            transform: "scale(0.98)",
        },
        "&:nth-child(3)": {
            zIndex: 3,
            top: `calc(${CARD_TOP_DIFF} * 2)`,
            transform: "scale(0.96)",
        },
        "&:nth-child(n+4)": {
            zIndex: 2,
            transform: "scale(0.7)",
        },
        "&::before": { // アニメーションでラベルを付与するために必要
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

    // 仕分けボタン
    buttons: {
        "& > *": {
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
        }
    },
    button: {
        border: "1px solid " + theme.palette.grey[400]
    },

    // アニメーション
    skipAnimation: {
        animation: "$skip .4s linear",
        animationFillMode: "both",
        "&:before": {
            transform: "rotateZ(-35deg)",
            background: "url(https://i.imgur.com/XqQZ4KR.png) no-repeat center 10px"
        }
    },
    likeAnimation: {
        animation: "$like .4s linear",
        animationFillMode: "both",
        "&:before": {
            transform: "rotateZ(-35deg)",
            background: "url(https://i.imgur.com/Zkwj970.png) no-repeat center 10px",
        }
    },
    "@keyframes skip": {
        "0%": {
            transform: "scale(1) rotateZ(360deg)",
            right: 0,
          },
          "30%": { 
            transform: "scale(1.05) rotateZ(360deg)",
            right: 0,
          },
          "100%": {
            transform: "rotateZ(315deg)",
            right: OFF_SCREEN,
          }
    },
    "@keyframes like": {
        "0%": {
            transform: "scale(1) rotateZ(0deg)",
            left: 0,
          },
          "30%": { 
            transform: "scale(1.05) rotateZ(0deg)",
            left: 0,
          },
          "100%": {
            transform: "rotateZ(45deg)",
            left: OFF_SCREEN,
          }
    },
}));

export function CardUI() {
    const classes = useStyles();

    // 仕分け用の配列
    const [people, setPeople] = useState(peopleData);
    const [liked, setLiked] = useState([]);
    const [skipped, setSkipped] = useState([]);

    // アニメーション用フラグ
    const [skipAnimation, setSkipAnimation] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);

    // 先頭のカードに渡すイベントハンドラー
    const handleSkipAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setSkipped([...skipped, ...people.slice(0, 1)]);
        setSkipAnimation(false);
    }, [people, skipped]);

    const handleLikeAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setLiked([...liked, ...people.slice(0, 1)]);
        setLikeAnimation(false);
    }, [people, liked]);

    // 仕分け用コントローラーに渡すイベントハンドラー
    const handleSkip = useCallback(() => {
        setSkipAnimation(true);
    }, []);

    const handleLike = () => {
        setLikeAnimation(true);
    };

    const empty = people.length === 0;

    return (
        <Box className={classes.wrapper}>
            {empty ? (
                <Grid
                    container
                    justify="center"
                    alignItems="center"
                    className={classes.doneMessage}
                >
                    <Grid item>
                        <Typography>仕分けが完了しました</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {[
                                `スキップ ${skipped.length}`,
                                `いいね ${liked.length}`,
                            ].join("　")}
                        </Typography>
                    </Grid>
                </Grid>
            ) : (
                <>
                    <Box className={classes.cards}>
                        {people.map((person, i) => {
                            const props = { person, key: person.id };
                            if (i === 0) { // 先頭のカードにはアニメーション用のCSSとイベントハンドラーを追加する
                                props.className = clsx({
                                    [classes.skipAnimation]: skipAnimation,
                                    [classes.likeAnimation]: likeAnimation,
                                });
                                props.onSkipAnimationEnd = handleSkipAnimationEnd;
                                props.onLikeAnimationEnd = handleLikeAnimationEnd;
                            }
                        
                            return (
                                <PersonCard {...props} />
                            );
                        })}
                    </Box>

                    <Box mt={1}>
                        <CardUIController 
                            onSkip={handleSkip}
                            onLike={handleLike}
                        />
                    </Box>
                </>
            )}
        </Box>
    );
}

/**
 * 人物カード
 */
function PersonCard(props) {
    const {
        person,
        className,
        onSkipAnimationEnd = () => {},
        onLikeAnimationEnd = () => {},
    } = props;

    const classes = useStyles();

    const handleAnimationEnd = (event) => {
        const animationName = event.animationName;

        if (animationName.includes("skip")) {
            onSkipAnimationEnd();
        } else if (animationName.includes("like")) {
            onLikeAnimationEnd();
        }
    }

    return (
        <Card className={clsx(classes.card, className)} onAnimationEnd={handleAnimationEnd}>
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
    );
}

/**
 * 仕分け用コントローラー
 */
function CardUIController({onSkip, onLike}) {
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
            <Grid item className={classes.buttons}>
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