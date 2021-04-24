import { makeStyles } from "@material-ui/core/styles";
import {
    Dialog,
    Card,
    CardHeader,
    Avatar,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
} from "@material-ui/core";
import format from "date-fns/format";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: "auto",
    }
}));

/**
 * 人物の詳細を表示するダイアログ
 * 
 * @param {Object} props.person 人物データ 
 * @param {boolean} props.open ダイアログが開いているかどうか
 * @param {Object} props.onClose ダイアログを閉じるときに呼び出すイベントハンドラー
 */
export function DetailDialog(props) {
    const { person, open, onClose } = props;

    const classes = useStyles();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Card>
                <CardHeader
                    avatar={<Avatar src={person.picture.thumbnail} alt={person.name.first} />}
                    title={`${person.name.first} ${person.name.last}`}
                    subheader={`${formatDate(person.registered.date)}に登録`}
                />
                <CardContent>
                    <DetailItem 
                        title={"生年月日"}
                        content={formatDate(person.dob.date)}
                    />
                    <DetailItem 
                        title={"年齢"}
                        content={`${person.dob.age}歳`}
                    />
                    <DetailItem 
                        title={"メールアドレス"}
                        content={person.email}
                    />
                </CardContent>
                <CardActions>
                    <Button color="primary" onClick={onClose} className={classes.button}>
                        閉じる
                    </Button>
                </CardActions>
            </Card>
        </Dialog>
    );
}

/**
 * 詳細の項目
 * 
 * @param {string} title
 * @param {string} content
 */
function DetailItem({title, content}) {
    return (
        <Box mb={1}>
            <Typography variant="caption" color="textSecondary">{title}</Typography>
            <Typography>{content}</Typography>
        </Box>
    );
}

/**
 * 日付を表す文字列をyyyy/MM/dd形式にフォーマットする
 * 
 * @param {string} date 
 */
function formatDate(date) {
    return format(new Date(date), "yyyy/MM/dd");
}