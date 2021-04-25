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
const variants = {
    skip: {

    },
    like: {

    },
}
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
 * @param {array} props.peopleData 人物の配列
 */
export function CardUI({peopleData}) {
    const classes = useStyles();

    const {
        people,
        liked,
        skipped,

        skipAnimation,
        likeAnimation,
        skipLabel,
        likeLabel,

        // ボタンによる仕分け用
        handleAnimationEnd,
        handleSkip,
        handleLike,

        // スワイプによる仕分け用
        handleSwipe,
        handleSwipeEnd,
        transformArgs,
        swipeProps,
    } = useCardUI(peopleData);


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
                            let props = {
                                person,
                                key: person.login.uuid,
                                transformArgs,
                            };
                            if (i === 0) { // 先頭のカードにはアニメーション用のCSSとイベントハンドラーを追加する
                                props = {
                                    ...props,
                                    // ボタンによる仕分け用
                                    className: clsx({
                                        [classes.skipAnimation]: skipAnimation,
                                        [classes.likeAnimation]: likeAnimation,
                                        [classes.skipLabel]: skipLabel,
                                        [classes.likeLabel]: likeLabel,
                                    }),
                                    onAnimationEnd: handleAnimationEnd,

                                    // スワイプによる仕分け用
                                    swipable: true,
                                    onSwipe: handleSwipe,
                                    onSwipeEnd: handleSwipeEnd,
                                    transformArgs,
                                    swipeProps,
                                };
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

/**
 * カードUI用のフック
 * 
 * @param {array} peopleData 人物の配列
 */
function useCardUI(peopleData) {
    // 仕分け用の配列
    const [people, setPeople] = useState(peopleData);
    const [liked, setLiked] = useState([]);
    const [skipped, setSkipped] = useState([]);

    // アニメーション用フラグ
    const [skipAnimation, setSkipAnimation] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);

    // 人物カードにラベルを付与するためのフラグ
    const [skipLabel, setSkipLabel] = useState(false);
    const [likeLabel, setLikeLabel] = useState(false);

    // 仕分け用イベントハンドラー
    const handleSkipAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setSkipped([...skipped, ...people.slice(0, 1)]);

        setSkipAnimation(false);
        setSkipLabel(false);
    }, [people, skipped]);

    const handleLikeAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setLiked([...liked, ...people.slice(0, 1)]);

        setLikeAnimation(false);
        setLikeLabel(false);
    }, [people, liked]);

    const handleAnimationEnd = useCallback((event) => {
        const animationName = event.animationName;
        console.log(animationName);

        if (animationName.includes("skip")) {
            handleSkipAnimationEnd();
        } else if (animationName.includes("like")) {
            handleLikeAnimationEnd();
        }
    }, [handleSkipAnimationEnd, handleLikeAnimationEnd])

    // 仕分け用コントローラーに渡すイベントハンドラー
    const handleSkip = useCallback(() => {
        setSkipAnimation(true);
    }, []);

    const handleLike = useCallback(() => {
        setLikeAnimation(true);
    }, []);

    // TODO framer-motionでアニメーションを設定する
    const animationProps = {

    };

    const swipe = useSwipe(
        handleSkipAnimationEnd,
        handleLikeAnimationEnd,
        setSkipLabel,
        setLikeLabel
    );

    return {
        people,
        liked,
        skipped,
        skipAnimation,
        likeAnimation,
        skipLabel,
        likeLabel,
        handleAnimationEnd,
        handleSkip,
        handleLike,
        ...swipe,
    };
}

/**
 * スワイプ操作用のフック
 * 
 * @param {Function} onSwipeSkipEnd スワイプによるスキップ終了時に呼び出すイベントハンドラー
 * @param {Function} onSwipeLikeEnd スワイプによるいいね終了時に呼び出すイベントハンドラー
 * @param {Function} setSkipLabel スキップラベルフラグの状態を変更する関数
 * @param {Function} setLikeLabel いいねラベルフラグの状態を変更する関数
 * @returns 
 */
function useSwipe(onSwipeSkipEnd, onSwipeLikeEnd, setSkipLabel, setLikeLabel) {
    // スワイプによる仕分け用のイベントハンドラー
   const handleSwipe = useCallback((x) => {
        if (x < 0) {
            setLikeLabel(false);
            setSkipLabel(true);
        } else {
            setSkipLabel(false);
            setLikeLabel(true);
        }
   }, [setLikeLabel, setSkipLabel]);

   const handleSwipeEnd = useCallback((x, controls) => {
        const THRESHOULD = 150; // 閾値

        if (Math.abs(x) <= THRESHOULD) { // スワイプ量の絶対値が閾値以下のときは仕分けしない
            controls.start({ x: 0 });
            // 人物カードのラベルをはずす
            if (x < 0) {
                setSkipLabel(false);
            } else {
                setLikeLabel(false);
            }
        } else if (x < -THRESHOULD) {
            onSwipeSkipEnd();
        } else if (x > THRESHOULD) {
            onSwipeLikeEnd();
    }
   }, [setSkipLabel, setLikeLabel, onSwipeSkipEnd, onSwipeLikeEnd]);

    return {
        handleSwipe,
        handleSwipeEnd,
        transformArgs: { // PersonCard内でuseTransform関数の引数に渡す値
            rotate: [[-200, 200], [-45, 45]],
            opacity: [[-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]],
        },
        swipeProps: {
            drag: "x",
            dragConstraints: { left: -200, right: 200 },
        }
    };
}
