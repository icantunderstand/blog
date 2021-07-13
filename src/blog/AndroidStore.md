---
title: 一起学Android-数据存储
date: 2021-6-29
tags: 跨端技术
path: /android-store
---

Android使用的文件系统提供了以下几种保存应用数据的选项:
* 应用专属存储空间 存储仅供应用使用的文件 存储在/data/data/package_name目录
* 共享存储 存储应用打算与其他应用共享的文件
* 偏好设置 以键值对的形式存储私有原始数据
* 数据库 将结构化数据存储到专用数据库中  

下面介绍几种常用的存储方式:
1. 文件存储
2. 键值存储(SharedPreferences)
3. 数据库存储(ROOM)  

## 文件存储  

| 方法名 | 作用 |
| ------ | ------ | 
| [openFileOutput(String name, int mode)](https://developer.android.com/reference/android/content/Context?hl=zh-cn#openFileOutput(java.lang.String,%20int)) | 用于文件写入，返回FileOutputStream。mode有MODE_PRIVATE/MODE_APPEND,MODE_APPEND模式会在已有文件的尾部追加内容 | 
| [openFileInput(String name)](https://developer.android.com/reference/android/content/Context?hl=zh-cn#openFileInput(java.lang.String)) | 用于文件的读取，返回FileInputStream |    

以下通过一个输入框存储和读取输入内容的例子来梳理文件存储的实现方式。
### 存储文件


    // 布局文件 定义一个居中显示的EditText 
    <?xml version="1.0" encoding="utf-8"?>
    <androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".MainActivity">
        <EditText
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            android:width="200dp"
            android:id="@+id/editText"
            android:lines="2"
        />
    </androidx.constraintlayout.widget.ConstraintLayout>
    // 活动文件
    public class MainActivity extends AppCompatActivity {
        private EditText editText;
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            // 读取对应id EditText中的输入
            editText = (EditText) findViewById(R.id.editText);
        }

        @Override
        protected void onDestroy() {
            super.onDestroy();
            String  inputText = editText.getText().toString();
            // 在活动destroy时候 获取editText的内容写入文件
            save(inputText);
        }
        public void save(String inputText) {
            FileOutputStream out = null;
            BufferedWriter writer = null;
            try {
              // 写入data文件 返回FileOutputStream
              out = openFileOutput("data", Context.MODE_PRIVATE);
              // 转换成字符输入流
              writer = new BufferedWriter(new OutputStreamWriter(out));
              // 写入文件
              writer.write(inputText);
            } catch(IOException e) {
                e.printStackTrace();
            } finally {
                try {
                    if(writer != null) {
                      // 关闭写入流 
                      writer.close();
                    }
                } catch(IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }  
在模拟器中启动程序，在输入框中输入内容test save file然后退出应用。通过Android Studio提供的Device File Explorer查下对应app下的目录文件内容已经正常写入。  
![保存数据](./AndroidStore/saveData.png)  

### 读取文件
在存储文件的基础上，在Activiy创建的时候读取存储文件，实现填写恢复功能。 


    public class MainActivity extends AppCompatActivity {
        private EditText editText;
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            editText = (EditText) findViewById(R.id.editText);
            // 读取文件内容 在存在内容的情况下直接设置内容
            String existText = load();
            editText.setText(existText);
            if(!TextUtils.isEmpty(existText)) {
                editText.setText(existText);
                editText.setSelection(existText.length());
            }
        }
        public String load() {
            FileInputStream in = null;
            BufferedReader reader = null;
            StringBuilder content = new StringBuilder();
            try {
                // 获取FileInputStream
                in = openFileInput("data");
                // 转换成读取流
                reader = new BufferedReader(new InputStreamReader(in));
                String line = "";
                // 分行读取文件内容写入
                while((line = reader.readLine()) != null) {
                    content.append(line);
                }
            } catch(IOException exception) {
                exception.printStackTrace();
            } finally {
                if(reader != null) {
                    try {
                      reader.close();
                    } catch(IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            // 返回读取内容
            return content.toString();
        }
    }

再次重启应用，输入框内已经默认填写的内容。  
![保存数据](./AndroidStore/readData.png)  
## 键值存储  

### SharedPreferences
| 方法名 | 含义 |
| ------ | ------ | 
| [getSharedPreferences(String name, int mode)](https://developer.android.com/reference/android/content/Context#getSharedPreferences(java.lang.String,%20int))) | 获取共享偏好设置文件 mode默认为MODE_PRIVATE | 
| [getPreferences()](https://developer.android.com/reference/android/app/Activity#getPreferences(int)) | 获取活动的偏好设置文件 |  

以下通过一个按钮触发存储和读取偏好设置文件来梳理键值存储的实现方式。

#### 存储键值
通过获取到的SharedPreferences的edit方法获取到SharedPreferences.Editor，主要通过调用SharedPreferences.Editor相关方法完成  

| 方法名 | 含义 |
| ------ | ------ | 
| [Editor.putInt](https://developer.android.com/reference/android/content/SharedPreferences.Editor#putInt(java.lang.String,%20int)) | 指定key写入数字内容 | 
| [Editor.putString](https://developer.android.com/reference/android/content/SharedPreferences.Editor#putString(java.lang.String,%20java.lang.String)) | 指定key写入字符内容 |  
| [Editor.apply](https://developer.android.com/reference/android/content/SharedPreferences.Editor#apply()) | 立即更改内存中的SharedPreferences对象，异步写入磁盘 |  
| [Editor.commit](https://developer.android.com/reference/android/content/SharedPreferences.Editor#commit()) | 更改SharedPreferences对象同步写入磁盘  |   


    public class MainActivity extends AppCompatActivity {
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            Button button = (Button) findViewById(R.id.buttonTest);
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                  // 获取SharedPreferences
                  SharedPreferences.Editor editor = getSharedPreferences("test", MODE_PRIVATE).edit();
                  editor.putString("toastStr", "hello you click me");
                  // apply完成写入
                  editor.apply();
                }
            });
        } 
    }  
通过查看对用应用的shared_prefs目录已经完成了写入
![写入SharedPreferences](./AndroidStore/writeSharedPerference.png)  
#### 读取键值
在上面的基础上按钮点击立即读取内容完成Toast提示。 


    public class MainActivity extends AppCompatActivity {
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            Button button = (Button) findViewById(R.id.buttonTest);
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    SharedPreferences.Editor editor = getSharedPreferences("test", MODE_PRIVATE).edit();
                    editor.putString("toastStr", "hello you click me");
                    editor.apply();
                    showSaveSharedPreference();
                }
            });
        }
        public void showSaveSharedPreference() {
            // 指定名称获取SharedPreferences
            SharedPreferences pref = getSharedPreferences("test", MODE_PRIVATE);
            // 通过getString/getInt读取存储内容
            String toastStr = pref.getString("toastStr", "");
            Toast.makeText(this, toastStr, Toast.LENGTH_LONG).show();
        }
    }

![读取SharedPreferences](./AndroidStore/readSharedPerference.png)  



## 数据库存储   
ROOM是SQLite上的抽象层，通过ROOM可以完成对数据库的存储。  
应用使用 Room 数据库来获取与该数据库关联的数据访问对象 (DAO)。然后，应用使用每个 DAO 从数据库中获取实体，然后再将对这些实体的所有更改保存回数据库中。 最后，应用使用实体来获取和设置与数据库中的表列相对应的值。  
![ROOM结构](roomStruct.png)  

在build.gradle中引入room依赖  


    dependencies {
        def room_version = "2.3.0"
        implementation 'androidx.appcompat:appcompat:1.3.0'
        implementation "androidx.room:room-runtime:$room_version"
        annotationProcessor "androidx.room:room-compiler:$room_version"
        implementation 'com.google.android.material:material:1.3.0'
        implementation 'androidx.constraintlayout:constraintlayout:2.0.4'
        testImplementation 'junit:junit:4.+'
        androidTestImplementation 'androidx.test.ext:junit:1.1.2'
        androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'
    }

### 定义实体

    // 实体会在数据库中创建对应的表
    @Entity()
    public class User {
        // 主键id自增
        @PrimaryKey(autoGenerate = true)
        public int id;
        public User(String name, int age) {
            this.name = name;
            this.age = age;
        }
        // 定义列
        @ColumnInfo()
        public String name;
        @ColumnInfo()
        public int age;
    }

### 定义Dao

    // Dao封装数据查询操作
    @Dao
    public interface UserDao {
        @Insert
        void insertUser(User user);

        @Query("SELECT * FROM User")
        List<User> getAll();
    };

### 定义数据库文件

    // 指定实体 版本
    @Database(entities = { User.class }, version = 2)
    public abstract class AppDataBase extends RoomDatabase {
        // 指定Dao
        public abstract UserDao userDao();
    }

### 访问数据


    public class MainActivity extends AppCompatActivity {
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            // 创建db
            AppDataBase db = Room.databaseBuilder(getApplicationContext(), AppDataBase.class, "dbTest").allowMainThreadQueries().build();
            // 插入数据
            db.userDao().insertUser(new User("xiaohong", 19));
            db.userDao().insertUser(new User("dawang", 19));
        }
    }  

通过Android Studio的Database Inspector查看已经在数据表中插入了对应的数据  
![显示DataBase](./AndroidStore/showDataBase.png)  
