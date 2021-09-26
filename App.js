/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import LottieView from 'lottie-react-native';
import AddSection from './components/AddSection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  light: {
    background: '#fff',
    headerTitle: '#52796F',
  },
  dark: {
    background: '#203031',
    headerTitle: '#fff',
  },
};

const MAIN = '#B7CDBC';
const MAIN2 = '#52796F';

export default function App() {
  let [TODOS, seTODOS] = React.useState([]);
  let [fiTODOS, seFiTODOS] = React.useState([]);
  const [dark, setDark] = React.useState(false);
  const [addTodo, setAddTodo] = React.useState(false);
  const [checkedShow, setCheckedShow] = React.useState(false);
  const [sortTask, setSortTask] = React.useState(false);
  const buttonAnimation = React.useRef();

  React.useEffect(() => {
    getTask();
    getFiTask();
    getTheme();
  }, []);

  //add unfinished tasks to async storage
  React.useEffect(() => {
    AsyncStorage.setItem('unFiTasls', JSON.stringify(TODOS));
  }, [TODOS]);

  //add finished tasks to async storage
  React.useEffect(() => {
    AsyncStorage.setItem('fiTasls', JSON.stringify(fiTODOS));
  }, [fiTODOS]);
  React.useEffect(() => {
    AsyncStorage.setItem('theme', JSON.stringify(dark));
  }, [dark]);

  // delete on press functions
  function todoDel(TODOid, TODOStat, i) {
    if (TODOStat) {
      TODOS[i].status = false;
      let statFalse = TODOS.filter(item => item.status === false);
      seFiTODOS([statFalse[0], ...fiTODOS]);

      let statTrue = TODOS.filter(item => item.status === true);
      seTODOS(statTrue);
    } else {
      seFiTODOS(fiTODOS.filter(item => item.id !== TODOid));
    }
  }

  // add new items to array
  function todoAdd(task, pri) {
    TODOS = [
      {
        title: task,
        priority: pri,
        status: true,
        id: Math.random().toString(),
      },
      ...TODOS,
    ];
    seTODOS(TODOS);
  }

  //this func plays the add button animation and closs the addSec and keyboard
  function buttonHandler() {
    buttonAnimation.current.play();
    setAddTodo(!addTodo);
    Keyboard.dismiss();
  }

  //get tasks from async storage
  async function getTask() {
    try {
      let unFiTasls = await AsyncStorage.getItem('unFiTasls');
      var parsunFiTasls = JSON.parse(unFiTasls);
      parsunFiTasls !== null ? seTODOS(parsunFiTasls) : seTODOS([]);
    } catch (error) {
      console.log(error);
    }
  }
  //get tasks from async storage
  async function getFiTask() {
    try {
      let finTODOS = await AsyncStorage.getItem('fiTasls');
      var parsfiTODOS = JSON.parse(finTODOS);
      parsfiTODOS !== null ? seFiTODOS(parsfiTODOS) : seFiTODOS([]);
    } catch (error) {
      console.log(error);
    }
  }
  async function getTheme() {
    try {
      let theme = await AsyncStorage.getItem('theme');
      var parsTheme = JSON.parse(theme);
      setDark(parsTheme);
    } catch (error) {
      console.log(error);
    }
  }

  //toggle theme
  const toggleDigit = useDerivedValue(() => {
    return dark ? withTiming(1) : withTiming(0);
  }, [dark]);

  const rstyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      toggleDigit.value,
      [0, 1],
      [COLORS.light.background, COLORS.dark.background],
    );
    return {backgroundColor};
  });
  const rTstyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      toggleDigit.value,
      [0, 1],
      [COLORS.light.headerTitle, COLORS.dark.headerTitle],
    );
    return {color};
  });

  function sort() {
    const sortedTasks = TODOS.sort((a, b) =>
      a.priority > b.priority ? 1 : -1,
    );
    seTODOS(sortedTasks);
    setSortTask(!sortTask);
  }

  //flatList renderItem items / task item design in fact
  const renderItem = ({item, index}) => (
    <TouchableOpacity onPress={() => todoDel(item.id, item.status, index)}>
      <View style={styles.item}>
        {item.priority === 'High' && item.status ? (
          <LottieView
            source={require('./assets/fire-loop.json')}
            {...(item.status ? 'loop' : 'loop={false}')}
            autoPlay
            style={styles.fire}
          />
        ) : (
          <View
            style={[
              styles.priority,
              item.priority === 'High' && {backgroundColor: '#FF3A2F'},
              item.priority === 'Normal' && {backgroundColor: '#FF9511'},
              item.priority === 'low' && {backgroundColor: '#32C759'},
            ]}
          />
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={[
              styles.title,
              dark ? {color: '#fff'} : {color: '#000'},
              !item.status && styles.checkedTitle,
              //item.priority === 'High' && {marginLeft: 36},
            ]}>
            {item.title}
          </Text>
          <View
            style={[
              styles.checkBox,
              dark ? {borderColor: '#B7CDBC'} : {borderColor: MAIN2},
              !item.status && {backgroundColor: MAIN2},
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, rstyle]}>
      <TouchableWithoutFeedback onPress={() => buttonHandler()}>
        <View
          intensity={90}
          tint="light"
          style={[
            styles.screenDisable,
            addTodo ? {height: '150%'} : {height: 0},
          ]}
        />
      </TouchableWithoutFeedback>

      <View style={styles.header}>
        <Animated.Text style={[styles.headerText, rTstyle]}>
          JUSTaTODO
        </Animated.Text>
        <TouchableWithoutFeedback onPress={() => setDark(!dark)}>
          {dark ? (
            <Ionicons name="ios-sunny-outline" size={26} color="#fff" />
          ) : (
            <MaterialCommunityIcons
              name="moon-waxing-crescent"
              size={24}
              color={MAIN2}
              style={{transform: [{translateX: -5}]}}
            />
          )}
        </TouchableWithoutFeedback>
      </View>

      {(TODOS.length === 0 || null) && fiTODOS.length === 0 ? (
        <LottieView
          source={require('./assets/empty_folder.json')}
          autoPlay
          loop
        />
      ) : (
        <View>
          <View style={{marginTop: 15}}>
            <TouchableOpacity onPress={() => sort()}>
              {(TODOS.length !== 0 || null) && (
                <MaterialIcons
                  name="sort"
                  size={24}
                  color={MAIN}
                  style={{marginLeft: 20}}
                />
              )}
            </TouchableOpacity>
            <FlatList
              data={TODOS}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>

          <View style={{marginTop: 15}}>
            {(fiTODOS.length !== 0 || null) && (
              <View
                style={{
                  paddingHorizontal: 20,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => setCheckedShow(!checkedShow)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  {checkedShow ? (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color={MAIN}
                      style={{marginTop: 15}}
                    />
                  ) : (
                    <MaterialIcons
                      name="arrow-drop-up"
                      size={24}
                      color={MAIN}
                      style={{marginTop: 15}}
                    />
                  )}
                  <Text style={{marginTop: 15, color: MAIN}}>
                    {fiTODOS.length}checked items
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => seFiTODOS([])}>
                  <Text style={{marginTop: 15, color: MAIN}}>Clear All</Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={fiTODOS}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              style={[
                {opacity: 0.5},
                checkedShow ? {height: 'auto'} : {height: 0},
              ]}
            />
          </View>
        </View>
      )}
      {
        <AddSection
          addTodo={addTodo}
          buttonHandler={buttonHandler}
          todoAdd={todoAdd}
          theme={dark}
        />
      }

      <TouchableOpacity
        onPress={() => buttonHandler()}
        style={styles.addButton}>
        <LottieView
          source={require('./assets/add_button.json')}
          ref={buttonAnimation}
          autoPlay={false}
          loop={false}
          speed={2}
          style={{width: 70, height: 70}}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 10,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  item: {
    height: 45,
    width: '100%',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginVertical: 10,
  },
  title: {
    fontFamily: 'ShabnamBold',
    marginRight: 20,
    fontSize: 17,
    maxWidth: '83%',
  },
  checkedTitle: {
    textDecorationLine: 'line-through',
  },
  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
  },
  screenDisable: {
    flex: 1,
    opacity: 0.5,
    zIndex: 20,
    position: 'absolute',
    top: 0,
    right: 0,
    width: '150%',
    height: '150%',
    backgroundColor: '#000',
  },
  priority: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  fire: {
    width: 80,
    height: 50,
    transform: [{translateX: -11}],
  },
  addButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
    backgroundColor: MAIN2,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
