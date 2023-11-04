
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { addDoc, collection, doc, Timestamp, onSnapshot, updateDoc, query, where, deleteDoc, } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
  const [isPopVisible, setPopVisible] = useState(false);
  const databass = collection(db, 'Todo');
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isCompletedView, setIsCompletedView] = useState(false);
  const userTasksCollection = collection(db, 'users', user.uid, 'Todo');

  const [note, setNote] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, category, description } = note;
    if (!title.trim() || !category || !description.trim()) {
      return;
    }
    try {
      if (isEditing) {
        const taskDocRef = doc(db, 'users', user.uid, 'Todo', editTaskId);
        const updatedNote = {
          title: note.title,
          category: note.category,
          description: note.description,
        };
        await updateDoc(taskDocRef, updatedNote);
        alert('Task is updated');
      } else {
        await addDoc(userTasksCollection, {
          title,
          category,
          description,
          completed: false,
          created: Timestamp.now(),
        });
        alert('Task is added');
      }
      setNote({
        title: '',
        category: '',
        description: '',
      });
      handleClosePopUp();
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const q = query(userTasksCollection, where('completed', '==', isCompletedView));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updateNote = [];
      querySnapshot.forEach((doc) => {
        updateNote.push({ id: doc.id, ...doc.data() });
      });
      setNotes(updateNote);
    });

    return () => unsubscribe();
  }, [user, isCompletedView]);

  const deleteData = async (noteId) => {
    const taskDocRef = doc(db, 'users', user.uid, 'Todo', noteId);
    try {
      await deleteDoc(taskDocRef);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = async (noteId) => {
    const existingNote = notes.find((note) => note.id === noteId);
    setNote({
      title: existingNote.title,
      category: existingNote.category,
      description: existingNote.description,
    });
    setEditTaskId(noteId);
    setPopVisible(true);
    setIsEditing(true);
  };

  const handleOpenPopUp = () => {
    setPopVisible(true);
    setEditTaskId(null);
    setIsEditing(false);
    setNote({
      title: '',
      category: '',
      description: '',
    });
  };

  const handleClosePopUp = () => {
    setPopVisible(false);
    setEditTaskId(null);
    setIsEditing(false);
    setNote({
      title: '',
      category: '',
      description: '',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      home: 'bg-[#A6D8A8]',
      work: 'bg-[#B7B1C9]',
      personal: 'bg-[#FCCD7C]',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      home: 'Home',
      work: 'Work',
      personal: 'Personal',
    };
    return labels[category] || category;
  };

  const getCategoryBorderColor = (category) => {
    const borderColors = {
      home: 'border-blue-600',
      work: 'border-green-600',
      personal: 'border-pink-600',
    };
    return borderColors[category];
  };

  const filterTasks = () => {
    if (isCompletedView) {
      return notes.filter((note) => note.completed);
    } else {
      return notes.filter((note) => {
        const matchCategory = selectedCategory === 'ALL' || note.category === selectedCategory;
        const matchSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
      });
    }
  };


  const handleTaskCompletion = (noteId, isCompleted) => {
    if (isCompleted) {
      const taskDocRef = doc(db, 'users', user.uid, 'Todo', noteId);
      updateDoc(taskDocRef, { completed: true });
    } else {
      const taskDocRef = doc(db, 'users', 'Todo', noteId);
      updateDoc(taskDocRef, { completed: false });
    }
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, completed: isCompleted } : note
    );
    setNotes(updatedNotes);
    if (isCompleted) {
      const completedTask = notes.find((note) => note.id === noteId);
      setCompletedTasks([...completedTasks, completedTask]);
    } else {
      const updatedCompletedTasks = completedTasks.filter((task) => task.id !== noteId);
      setCompletedTasks(updatedCompletedTasks);
    }
  }
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/');
  };
  return (
    <div className='bg-[#F5F5F5] min-h-screen font-poppins'>
      <div className='max-w-screen-lg mx-auto p-4'>
        <div className='flex items-center justify-between'>
          <div className='relative w-10/12'>
            <FontAwesomeIcon icon={faSearch} className='absolute top-3 left-3 text-gray-500' />
            <input
              type='search'
              id='Search'
              className='w-full py-2 px-9 bg-white shadow-md'
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className='bg-blue-500 text-white text-sm px-14 py-3  rounded'
            onClick={handleOpenPopUp}
          >
            + ADD
          </button>
        </div>
        <div className='mt-8 grid grid-cols-5 md:grid-cols-5 lg:grid-cols-8 gap-2'>
          <button
            className={`rounded-full py-2 ${selectedCategory === 'ALL' ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            ALL
          </button>
          <button
            className={`rounded-full px-3 ${selectedCategory === 'home' ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setSelectedCategory('home')}
          >
            Home
          </button>
          <button
            className={`rounded-full px-3 ${selectedCategory === 'work' ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setSelectedCategory('work')}
          >
            Work
          </button>
          <button
            className={`rounded-full px-3 ${selectedCategory === 'personal' ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setSelectedCategory('personal')}
          >
            Personal
          </button>
          <div className='col-span-3'></div>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='completedTasks'
              checked={isCompletedView}
              className='mr-2'
              onChange={() => setIsCompletedView(!isCompletedView)}
            />
            <label htmlFor='completedTasks'> Completed</label>
          </div>

        </div>
      </div>

      {isPopVisible && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-5 rounded shadow-lg'>
            <h2 className='text-lg font-semibold mb-3'>{isEditing ? 'EDIT NOTE' : 'ADD NOTE'}</h2>
            <div className='border border-black mb-7'></div>
            <form onSubmit={handleSubmit} >
              <div className='mb-7 items-center inline-block '>
                <input
                  type='text'
                  placeholder='Add Title...'
                  id='taskName'
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                  className='w-full border rounded bg-[#F4F4F4] px-20 pl-1 py-2 mr-10'
                />
              </div>
              <div className='mb-4 items-center inline-block ml-10'>
                <select
                  id='category'
                  value={note.category}
                  onChange={(e) => setNote({ ...note, category: e.target.value })}
                  className='w-full border rounded px-3 py-2 bg-[#F4F4F4]'
                >
                  <option value='' disabled>
                    Select category
                  </option>
                  <option value='home'>Home</option>
                  <option value='work'>Work</option>
                  <option value='personal'>Personal</option>
                </select>
              </div>
              <div className='mb-4'>
                <textarea
                  id='description'
                  placeholder='Description'
                  value={note.description}
                  onChange={(e) => setNote({ ...note, description: e.target.value })}
                  className='border bg-[#F4F4F4] rounded px-36 py-7 pl-2'
                ></textarea>
              </div>
              <div className='flex justify-end'>
                <button onClick={handleClosePopUp}>CANCEL</button>
                <button type='submit' className='text-blue-600 px-3 py-2 ml-6'>
                  {isEditing ? 'UPDATE' : 'ADD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className='max-w-screen-lg mx-auto p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
          {isCompletedView
            ? completedTasks.map((note) => (
              <div
                key={note.id}
                className={`bg-white p-4 shadow-md rounded line-through text-gray-400`}
              >
                <h1 className='text-lg'>{note.title}</h1>
                <p className='text-xs'>{note.description}</p>
                <div className='flex justify-between mt-2'>
                  <div className='text-gray-500 text-sm mt-3'>
                    {new Date(note.created.toMillis()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
            : filterTasks().map((note) => (
              <div
                key={note.id}
                className={`bg-white p-4 shadow-md rounded ${note.completed ? 'line-through text-gray-400' : ''
                  }`} >
                <div className={`flex justify-between items-center mb-2 ${getCategoryBorderColor(note.category)}`}>
                  <span className={`rounded-full text-sm px-2 text-white ${getCategoryColor(note.category)}`}>
                    {getCategoryLabel(note.category)}
                  </span>
                  <label className='flex items-center m-2'>
                    <input
                      className='ml-1'
                      type='checkbox'
                      checked={note.completed}
                      onChange={(e) => handleTaskCompletion(note.id, e.target.checked)}
                    />
                  </label>
                  <div className='flex items-center'>
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => handleEdit(note.id)}
                      className='text-blue-600 cursor-pointer'
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteData(note.id)}
                      className='text-red-600 cursor-pointer ml-2'
                    />
                  </div>
                </div>
                <h1 className='text-lg'>{note.title}</h1>
                <p className='text-xs'>{note.description}</p>
                <div className='flex justify-between mt-2'>
                  <div className='text-gray-500 text-sm mt-3'>
                    {new Date(note.created.toMillis()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex justify-between items-center">
        <p className="text-gray-500">NOTE APP BY ADNAN © 2023</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleNavigation}
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Home;
