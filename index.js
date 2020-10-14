import React, {useState, useRef} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView
} from "react-native";
import Task from "./Task";

let statusAPI;

function Init(api) {
    statusAPI = api;
}

function ExtensionView() {
    const [today, setToday] = useState([]);
    const [yesterday, setYesterday] = useState([]);
    const [blockers, setBlockers] = useState([]);

    const handleSend = () => {
        const result =
            (yesterday.length
                ? "**Yesterday**\n" +
                yesterday.map((val) => {
                    return "- " + val.text;
                }).join("\n")
                : "") +
            (today.length
                ? "\n\n**Today**\n" +
                today.map((val) => {
                    return "- " + val.text;
                }).join("\n")
                : "") +
            (blockers.length
                ? "\n\n**Blockers**\n" +
                blockers.map((val) => {
                    return "- " + val.text;
                }).join("\n")
                : "");

        statusAPI.sendTextMessage(result);
        statusAPI.close();
    };

    return (
        <View style={{flex: 1, paddingBottom: 20}}>
            <TouchableOpacity onPress={()=>{statusAPI.close()}}>
                <View style={{height: 26, width: 26, marginTop: 10, marginLeft: 10, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontWeight: "bold"}}>X</Text>
                </View>
            </TouchableOpacity>
            <ScrollView keyboardShouldPersistTaps={"handled"}>
                <View>
                    <SectionView
                        autoFocus={true}
                        title={"Yesterday"}
                        values={yesterday}
                        setValues={setYesterday}
                    />
                    <SectionView title={"Today"} values={today} setValues={setToday}/>
                    <SectionView
                        title={"Blockers"}
                        values={blockers}
                        setValues={setBlockers}
                    />
                </View>
            </ScrollView>
            <TouchableOpacity
                style={{alignSelf: "center"}}
                onPress={() => handleSend()}
            >
                <Text style={{fontSize: 24, marginTop: 20, color: "#4360df"}}>
                    Send
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function SectionView(props) {
    const [value, setValue] = useState("");
    const todos = props.values;
    const setTodos = props.setValues;
    const inp = useRef(null);

    const handleAddTodo = () => {
        if (value.length > 0) {
            setTodos([...todos, {text: value, key: Date.now(), checked: false}]);
            setValue("");
        }
        inp.current.clear();
        inp.current.focus();
    };

    const handleDeleteTodo = (id) => {
        setTodos(
            todos.filter((todo) => {
                if (todo.key !== id) return true;
            })
        );
        inp.current.focus();
    };

    return (
        <View style={styles.container}>
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    autoFocus={props.autoFocus}
                    multiline={false}
                    onChangeText={(value) => setValue(value)}
                    onSubmitEditing={(event) => handleAddTodo()}
                    blurOnSubmit={false}
                    placeholder={props.title}
                    placeholderTextColor="gray"
                    ref={inp}
                />
                <TouchableOpacity onPress={() => handleAddTodo()}>
                    <View style={{marginLeft: 10, paddingHorizontal: 10}}>
                        <Text style={{fontSize: 30, color: "#4360df"}}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                {todos.map((task) => (
                    <Task
                        text={task.text}
                        key={task.key}
                        checked={task.checked}
                        showDel={true}
                        delete={() => handleDeleteTodo(task.key)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    textInput: {
        flex: 1,
        fontSize: 20,
        paddingLeft: 10
    },
    taskWrapper: {
        marginTop: "5%",
        flexDirection: "row",
        // alignItems: 'baseline',
        borderColor: "#D0D0D0",
        borderBottomWidth: 0.5,
        width: "100%",
        alignItems: "stretch",
        minHeight: 40
    },
    task: {
        paddingBottom: 20,
        paddingLeft: 10,
        paddingTop: 6,
        borderBottomWidth: 1,
        fontSize: 17,
        fontWeight: "bold"
    },
    textInputContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 5,
        marginBottom: 10
    }
});

export default [{
    scope: ["PERSONAL_CHATS"],
    type: "CHAT_COMMAND",
    view: ExtensionView,
    init: Init
}]
