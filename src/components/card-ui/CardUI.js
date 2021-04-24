import { useState, useCallback } from "react";
import { PersonCard } from "./PersonCard";
import { Controller } from "./Controller";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
    Box,
    Grid,
    Typography,
} from "@material-ui/core";

// カードラッパー用
const CARD_MAX_WIDTH = "500px";
const CARD_CONTENT_HEIGHT = "72px"
export const CARD_TOP_DIFF = "10px";

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

/**
 * Tinder風カードUI
 * 
 * @param {array} props.people 人物の配列
 */
export function CardUI(props) {
    const classes = useStyles();

    // 仕分け用の配列
    const [people, setPeople] = useState(props.people);
    const [liked, setLiked] = useState([]);
    const [skipped, setSkipped] = useState([]);

    // アニメーション用フラグ
    const [skipAnimation, setSkipAnimation] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);

     // 人物カードにラベルを付与するためのフラグ
     const [skipLabel, setSkipLabel] = useState(false);
     const [likeLabel, setlikeLabel] = useState(false);

    // 先頭のカードに渡すイベントハンドラー
    // スワイプによる仕分け用
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

    // 仕分け用（ボタンとスワイプの両方）
    const handleSkipAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setSkipped([...skipped, ...people.slice(0, 1)]);

        setSkipAnimation(false);
        handleSwipeSkipCanceled();
    }, [people, skipped, handleSwipeSkipCanceled]);

    const handleLikeAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setLiked([...liked, ...people.slice(0, 1)]);

        setLikeAnimation(false);
        handleSwipeLikeCanceled();
    }, [people, liked, handleSwipeLikeCanceled]);

    // 仕分け用コントローラーに渡すイベントハンドラー
    const handleSkip = useCallback(() => {
        setSkipAnimation(true);
    }, []);

    const handleLike = useCallback(() => {
        setLikeAnimation(true);
    }, []);

    return (
        <Box className={classes.wrapper}>
            {people.length === 0? (
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
                            const props = { person, key: person.login.uuid };
                            if (i === 0) { // 先頭のカードにはアニメーション用のCSSとイベントハンドラーを追加する
                                // ボタンによる仕分け用
                                props.className = clsx({
                                    [classes.skipAnimation]: skipAnimation,
                                    [classes.likeAnimation]: likeAnimation,
                                    [classes.skipLabel]: skipLabel,
                                    [classes.likeLabel]: likeLabel,
                                });

                                // スワイプによる仕分け用
                                props.swipable = true;
                                props.onSwipeSkip = handleSwipeSkip;
                                props.onSwipeLike = handleSwipeLike;
                                props.onSwipeSkipCanceled = handleSwipeSkipCanceled;
                                props.onSwipeLikeCanceled = handleSwipeLikeCanceled;

                                // 仕分け用（ボタンとスワイプの両方）
                                props.onSkipAnimationEnd = handleSkipAnimationEnd;
                                props.onLikeAnimationEnd = handleLikeAnimationEnd;
                            }
                        
                            return (
                                <PersonCard {...props} />
                            );
                        })}
                    </Box>

                    <Box mt={1} mb={1}>
                        <Controller 
                            onSkip={handleSkip}
                            onLike={handleLike}
                        />
                    </Box>
                </>
            )}
        </Box>
    );
}