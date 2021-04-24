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
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";

// カードラッパー用
const CARD_MAX_WIDTH = "500px";
const CARD_CONTENT_HEIGHT = "72px"
const CARD_TOP_DIFF = "10px";

// カードアニメーション用
const OFF_SCREEN = "400px";
const skipLabel = {
    "&::before": {
        transform: "rotateZ(35deg)",
        background: "url(https://i.imgur.com/XqQZ4KR.png) no-repeat center 10px"
    }
};
const likeLabel = {
    "&::before": {
        transform: "rotateZ(-35deg)",
        background: "url(https://i.imgur.com/Zkwj970.png) no-repeat center 10px",
    }
};


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
        transition: "all .2s linear",
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
    swipableCard: {
        overflow: "initial"
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
        ...skipLabel,
    },
    likeAnimation: {
        animation: "$like .4s linear",
        animationFillMode: "both",
        ...likeLabel,
    },
    skipLabel,
    likeLabel,
    "@keyframes skip": {
        "0%": {
            transform: "scale(1) rotateZ(360deg)",
            right: 0,
            opacity: 1,
          },
          "30%": { 
            transform: "scale(1.05) rotateZ(360deg)",
            right: 0,
            opacity: 1,
          },
          "100%": {
            transform: "rotateZ(315deg)",
            right: OFF_SCREEN,
            opacity: 0,
          }
    },
    "@keyframes like": {
        "0%": {
            transform: "scale(1) rotateZ(0deg)",
            left: 0,
            opacity: 1,
          },
          "30%": { 
            transform: "scale(1.05) rotateZ(0deg)",
            left: 0,
            opacity: 1,
          },
          "100%": {
            transform: "rotateZ(45deg)",
            left: OFF_SCREEN,
            opacity: 0,
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

     // 人物カードにラベルを付与するためのフラグ
     const [skipLabel, setSkipLabel] = useState(false);
     const [likeLabel, setlikeLabel] = useState(false);

    // 先頭のカードに渡すイベントハンドラー
    const handleSkipAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setSkipped([...skipped, ...people.slice(0, 1)]);

        setSkipAnimation(false);
        handleSwipeSkipCanceled();
    }, [people, skipped, skipLabel]);

    const handleLikeAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setLiked([...liked, ...people.slice(0, 1)]);

        setLikeAnimation(false);
        handleSwipeLikeCanceled();
    }, [people, liked, likeLabel]);

    const handleSwipeSkip = useCallback(() => {
        if (likeLabel) {
            setlikeLabel(false);
        }
        if (!skipLabel) {
            setSkipLabel(true);
        }
    }, [skipLabel, likeLabel]);

    const handleSwipeLike = useCallback(() => {
        if (skipLabel) {
            setSkipLabel(false);
        }
        if (!likeLabel) {
            setlikeLabel(true);
        }
    }, [likeLabel, skipLabel]);

    const handleSwipeSkipCanceled = useCallback(() => {
        if (skipLabel) {
            setSkipLabel(false);
        }
    }, [skipLabel]);

    const handleSwipeLikeCanceled = useCallback(() => {
        if (likeLabel) {
            setlikeLabel(false);
        }
    }, [likeLabel]);

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
                                // ボタンによる仕分け用
                                props.className = clsx({
                                    [classes.skipAnimation]: skipAnimation,
                                    [classes.likeAnimation]: likeAnimation,
                                    [classes.skipLabel]: skipLabel,
                                    [classes.likeLabel]: likeLabel,
                                });
                                props.onSkipAnimationEnd = handleSkipAnimationEnd;
                                props.onLikeAnimationEnd = handleLikeAnimationEnd;

                                // スワイプによる仕分け用
                                props.swipable = true;
                                props.onSwipeSkip = handleSwipeSkip;
                                props.onSwipeLike = handleSwipeLike;
                                props.onSwipeSkipCanceled = handleSwipeSkipCanceled;
                                props.onSwipeLikeCanceled = handleSwipeLikeCanceled;
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
        swipable = false,
        onSwipeSkip = () => {},
        onSwipeLike = () => {},
        onSwipeSkipCanceled = () => {},
        onSwipeLikeCanceled = () => {},
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

    // スワイプ量によって変化する値
    const x = useMotionValue(0, );
    const rotate = useTransform(x, [-200, 200], [-45, 45]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    const controls = useAnimation();

    // スワイプの設定
    const motionProps = swipable
        ? {
            drag: "x",
            dragConstraints: { left: -200, right: 200 },
            animate: controls,
            style: {
                x,
                rotate,
                opacity,
            },
            onDrag: () => {
                const motionX = x.get();
                // 人物カードにラベルを付ける
                if (motionX < 0) {
                    onSwipeSkip();
                } else {
                    onSwipeLike();
                }
            },
            onDragEnd: () => {
                const THRESHOULD = 150; // 閾値
                const motionX = x.get();

                if (Math.abs(motionX) <= THRESHOULD) { // スワイプ量の絶対値が閾値以下のときは仕分けしない
                    controls.start({ x: 0 });
                    // 人物カードのラベルをはずす
                    if (motionX < 0) {
                        onSwipeSkipCanceled();
                    } else {
                        onSwipeLikeCanceled()
                    }
                } else if (motionX <= -THRESHOULD) {
                    onSkipAnimationEnd();
                } else if (motionX >= THRESHOULD) {
                    onLikeAnimationEnd();
                }
            }
            
        }
        : {};

    return (
        <motion.div
            {...motionProps}
            className={clsx(classes.card, className)}
            onAnimationEnd={handleAnimationEnd}
            
        >
            <Card >
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
        </motion.div>
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