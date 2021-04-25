import { useState, useCallback } from "react";
import { CARD_TOP_DIFF } from "./CardUI";
import { DetailDialog } from "./DetailDialog";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
} from "@material-ui/core";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";

const useStyles = makeStyles((theme) => ({
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
        display: "flex",
        alignItems: "center",
        "& > *:not(:last-child)": {
            marginRight: theme.spacing(1)
        }
    },
    swipableCard: {
        overflow: "initial"
    },
    detailButton: {
        marginLeft: "auto",
    }
}));

/**
 * 人物カード
 * 
 * @param {Object} props.person 人物データ
 * @param {string} props.className アニメーション用CSSのクラス名
 * @param {Function} props.onAnimationEnd アニメーション終了時に呼び出すイベントハンドラー
 * @param {boolean} props.swipable スワイプが可能かどうか
 * @param {Function} props.onSwipe スワイプ時に呼び出すイベントハンドラー
 * @param {Function} props.onSwipeEnd　スワイプ終了時呼び出すイベントハンドラー
 */
export function PersonCard(props) {
    const {
        person,
        className,
        onAnimationEnd = () => {},
        swipable = false,
        onSwipe = () => {},
        onSwipeEnd = () => {},
    } = props;

    const classes = useStyles();

    // スワイプ量によって変化する値
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-45, 45]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    const controls = useAnimation();

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
                onSwipe(x.get());
            },
            onDragEnd: () => {
                onSwipeEnd(x.get(), controls);
            }
            
        }
        : {};

        // 詳細ダイアログ用
        const [open, setOpen] = useState(false);
        const handleOpen = useCallback(() => {
            setOpen(true);
        }, []);
        const handleClose = useCallback(() => {
            setOpen(false);
        }, []);

    return (
        <motion.div
            {...motionProps}
            className={clsx(classes.card, className)}
            onAnimationEnd={onAnimationEnd}
            
        >
            <Card >
                <CardMedia
                    image={person.picture.large}
                    title={person.name.first}
                    className={classes.image}
                />
                <CardContent className={classes.cardContent}>
                    <Typography variant="h6" component="span">
                        {person.name.first}
                    </Typography>
                    <Typography color="textSecondary" component="span">
                        {person.dob.age}
                    </Typography>
                    <Button color="primary" className={classes.detailButton} onClick={handleOpen}>
                        詳細を見る
                    </Button>
                </CardContent>
            </Card>

            <DetailDialog 
                person={person}
                open={open}
                onClose={handleClose}
            />
        </motion.div>
    );
}