import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Run this once to populate your Firebase with sample data
export const seedDatabase = async () => {
  try {
    console.log('Seeding database...');
    
    // Create sample students
    const students = [
      { firstName: 'John', lastName: 'Doe', studentId: 'S001', grade: '10', parentName: 'Jane Doe', parentEmail: 'jane@example.com', status: 'Active' },
      { firstName: 'Alice', lastName: 'Smith', studentId: 'S002', grade: '9', parentName: 'Bob Smith', parentEmail: 'bob@example.com', status: 'Active' },
      { firstName: 'Mike', lastName: 'Johnson', studentId: 'S003', grade: '11', parentName: 'Sarah Johnson', parentEmail: 'sarah@example.com', status: 'Warning' },
    ];
    
    for (const student of students) {
      await addDoc(collection(db, 'students'), {
        ...student,
        createdAt: Timestamp.now()
      });
    }
    
    // Create sample teachers
    const teachers = [
      { name: 'Mr. Smith', email: 'smith@school.edu', subject: 'Mathematics', status: 'Active' },
      { name: 'Ms. Johnson', email: 'johnson@school.edu', subject: 'Science', status: 'Active' },
      { name: 'Mr. Davis', email: 'davis@school.edu', subject: 'History', status: 'Active' },
    ];
    
    for (const teacher of teachers) {
      await addDoc(collection(db, 'teachers'), {
        ...teacher,
        createdAt: Timestamp.now()
      });
    }
    
    // Create sample forum posts
    const forumPosts = [
      { title: 'Welcome to the Forum', content: 'This is a place for discussion...', category: 'General Discussion', authorName: 'Admin', visibility: 'public', likes: 5, isPinned: true },
      { title: 'New Teaching Strategy', content: 'I found this new method...', category: 'Teaching Strategies', authorName: 'Mr. Smith', visibility: 'public', likes: 3 },
    ];
    
    for (const post of forumPosts) {
      await addDoc(collection(db, 'forum_posts'), {
        ...post,
        createdAt: Timestamp.now(),
        replies: []
      });
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};