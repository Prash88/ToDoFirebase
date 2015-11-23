/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Component,
  TouchableHighlight,
  TextInput,
  ListView,
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;
var Firebase = require('firebase');

class ToDoFirebase extends Component {
  constructor(props) {
    super(props);
    var myFirebaseref =
      new Firebase('https://todoreactfirebase.firebaseio.com/');
    this.itemsRef = myFirebaseref.child('items');
    this.state = {
      newToDo: '',
      toDoSource:
        new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    }
    this.items = [];
  }

  componentDidMount() {
    this.itemsRef.on('child_added', (dataSnapshot) => {
      this.items.push({id: dataSnapshot.key(), text: dataSnapshot.val()});
      this.setState({
        toDoSource: this.state.toDoSource.cloneWithRows(this.items)
      });
    });
    this.itemsRef.on('child_removed', (dataSnapshot) => {
      this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
      this.setState({
        toDoSource: this.state.toDoSource.cloneWithRows(this.items)
      });
    });
  }

  addToDo() {
    if(this.state.newToDo !== '') {
      this.itemsRef.push({
        todo: this.state.newToDo
      });
      this.setState({
        newToDo: ''
      });
    }
  }

  removeToDo(rowData) {
    this.itemsRef.child(rowData.id).remove();
  }

  render() {
    return(
      <View style={styles.appContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>
            My Todo's
          </Text>
        </View>
        <View style={styles.inputcontainer}>
          <TextInput style={styles.input}
            onChangeText={(text) => this.setState({newToDo: text})}
            value={this.state.newToDo}/>
          <TouchableHighlight
            style={styles.button}
            onPress={() => this.addToDo()}
            underlayColor='#dddddd'>
            <Text style={styles.btnText}>Add!</Text>
          </TouchableHighlight>
        </View>
        <ListView
          dataSource={this.state.toDoSource}
          renderRow={this.renderRow.bind(this)}/>
      </View>
    )
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        underlayColor='#dddddd'
        onPress={() => this.removeToDo(rowData)}>
        <View>
          <View style={styles.row}>
            <Text style={styles.todoText}>{rowData.text}</Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    )
  }

}

var styles = StyleSheet.create({
  appContainer:{
    flex: 1
  },
  titleView:{
    backgroundColor: '#48afdb',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  titleText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
  },
  inputcontainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: 4,
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6,
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48BBEC'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  todoText: {
    flex: 1,
  }
});

AppRegistry.registerComponent('ToDoFirebase', () => ToDoFirebase);
