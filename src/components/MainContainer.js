import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Container,
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CircularProgress
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    main: {
        height: "calc(100vh - 56px)", 
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: { 
            height: "calc(100vh - 46px)", 
        },
        [theme.breakpoints.up('sm')]: { 
            height: "calc(100vh - 64px)", 
        },
        padding: theme.spacing(4)
    },
    progressWrapper: {
        display: "flex",
        justifyContent: "center",
    }
}));

/**
 * mainタグコンポーネント
 * 
 * @param {array} props.errors - ページ内で発生する可能性のあるエラー
 * @param {array} props.resources - 初回の描画時に読み込むAPIリソース
 * @param {string} props.maxWidth - 横幅の最大値を示す文字列
 */
export function MainContainer(props) {
    const {
        children,
        errors = [],
        resources = [],
        maxWidth = "sm",
        ...rest
    } = props;

    const classes = useStyles();

    const [error, setError] = useState(null); // ページ内で発生したエラー
    const [loading, setLoading] = useState(true); // APIリソースの読み込み状況

    // エラーハンドリング
    useEffect(() => {
        for (let i = 0; i < errors.length; i++) {
            if (errors[i]) {
                setError(errors[i]);
                break;
            } else if (i === errors.length - 1) {
                setError(null);
            }
        }
    }, [errors]);
 
    // APIリソースの読み込み状況の確認
    useEffect(() => {
        setLoading(resources.some(resource => {
            return ! Boolean(resource);
        }));
    }, [resources]);

    return (
        <Container
            component="main"
            maxWidth={error ? "xs" : maxWidth}
            className={classes.main}
            {...rest}
        >
            {error ? (
                <Card>
                    <CardHeader
                        title={<Typography variant="h6" component="h1">エラー</Typography>}
                    />
                    <CardContent>
                        <Typography variant="body1">{error.message}</Typography>
                    </CardContent>
                </Card>
            ) : 
            loading ? (
                <Box className={classes.progressWrapper}>
                    <CircularProgress color="secondary" data-testid="progress" />
                </Box>
            ) : (
                children
            )}
        </Container>
    );
}