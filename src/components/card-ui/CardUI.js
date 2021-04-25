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
import { useAnimation } from "framer-motion";

// カードラッパー用
const CARD_MAX_WIDTH = "500px";
const CARD_CONTENT_HEIGHT = "72px"
export const CARD_TOP_DIFF = "10px";

// カードアニメーション用
const OFF_SCREEN = 400;
const animationProps = {
    variants: {
        skip: {
            scale: [1, 1.05, 1.05],
            rotate: [0, 0, -45],
            x: [0, 0, -OFF_SCREEN],
            opacity: [1, 1, 0],
        },
        like: {
            scale: [1, 1.05, 1.05],
            rotate: [0, 0, 45],
            x: [0, 0, OFF_SCREEN],
            opacity: [1, 1, 0],
        },
        initial: {},
    },
    transition: {
        duration: .4,
        ease: "linear",
    }
};

// スワイプ操作用
const transformArgs = { // PersonCard内でuseTransform関数の引数に渡す値
    rotate: [[-200, 200], [-45, 45]],
    opacity: [[-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]],
};
const swipeProps = {
    drag: "x",
    dragConstraints: { left: -200, right: 200 },
};

const useStyles = makeStyles((theme) => ({
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
    result: {
        "& > span:not(:last-child)": {
            marginRight: theme.spacing(1),
        }
    },
    skipLabel: {
        "&::before": {
            transform: "rotateZ(35deg)",
            background: "url(https://i.imgur.com/XqQZ4KR.png) no-repeat center 10px"
        }
    },
    likeLabel: {
        "&::before": {
            transform: "rotateZ(-35deg)",
            background: "url(https://i.imgur.com/Zkwj970.png) no-repeat center 10px",
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
        // 仕分け用の配列
        people,
        liked,
        skipped,

        // アニメーション用
        animation,
        skipLabel,
        likeLabel,

        // ボタンによる仕分け用
        handleAnimationEnd,
        handleSkip,
        handleLike,

        // スワイプによる仕分け用
        handleSwipe,
        handleSwipeEnd,
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
                    <Grid item className={classes.result}>
                        <Typography>仕分けが完了しました</Typography>
                        {([
                            {
                                content: `スキップ ${skipped.length}`,
                                testId: "skip-count",
                            },
                            {
                                content: `いいね ${liked.length}`,
                                testId: "like-count",
                            }
                        ]).map((text, i) => (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="span"
                                key={i}
                                data-testid={text.testId}
                            >
                                {text.content}
                            </Typography>
                        ))}
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
                                    // 仕分け用（ボタンとスワイプ両方）
                                    className: clsx({
                                        [classes.skipLabel]: skipLabel,
                                        [classes.likeLabel]: likeLabel,
                                    }),
                                    animation,

                                    // ボタンによる仕分け用
                                    animationProps,
                                    onAnimationEnd: handleAnimationEnd,

                                    // スワイプによる仕分け用
                                    swipable: true,
                                    onSwipe: handleSwipe,
                                    onSwipeEnd: handleSwipeEnd,
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

    // アニメーション用
    const animation = useAnimation();

    // 人物カードにラベルを付与するためのフラグ
    const [skipLabel, setSkipLabel] = useState(false);
    const [likeLabel, setLikeLabel] = useState(false);

    // 仕分け用イベントハンドラー
    const handleSkipAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setSkipped([...skipped, ...people.slice(0, 1)]);

        setSkipLabel(false);
    }, [people, skipped]);

    const handleLikeAnimationEnd = useCallback(() => {
        setPeople(people.slice(1));
        setLiked([...liked, ...people.slice(0, 1)]);

        setLikeLabel(false);
    }, [people, liked]);

    const handleAnimationEnd = useCallback((animationName) => {
        if (animationName === "skip") {
            handleSkipAnimationEnd();
        } else if (animationName === "like") {
            handleLikeAnimationEnd();
        }
    }, [handleSkipAnimationEnd, handleLikeAnimationEnd]);

    // 仕分け用コントローラーに渡すイベントハンドラー
    const handleSkip = useCallback(() => {
        setSkipLabel(true);
        animation.start("skip");
    }, [animation]);

    const handleLike = useCallback(() => {
        setLikeLabel(true);
        animation.start("like");
    }, [animation]);

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
        animation,
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
    };
}
