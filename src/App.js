import { useCallback, useEffect, useState } from 'react';
import uuid from 'uuid-random';
import './App.css'



const getLocalData = () => {
  const books = localStorage.getItem('books');
  if (books) {
    return JSON.parse(books)
  }
  return []
}

function App() {


  const [books, setBooks] = useState(getLocalData())
  const [toggle, setToggle] = useState(true)
  const [editId, setEditId] = useState()
  const [search, setSearch] = useState()
  const [searchData, setSearchData] = useState()

  const uid = uuid();

  const [book, setBook] = useState({ title: '', author: '', isbn: uid })

  const handleOnchange = (data) => {
    setBook({ ...book, [data.target.name]: data.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (toggle) {
      setBooks([...books, book])
      setBook({ title: '', author: '', isbn: uid })
    } else if (!toggle) {
      const updateData = books.map(curelm => {
        if (editId === curelm.isbn) {
          return { ...curelm, title: book.title, author: book.author }
        }
        return curelm;
      })
      setBooks(updateData)
      setBook({ title: '', author: '', isbn: uid })
      setToggle(true)
      setSearch([])
    }

  }

  const deleteData = (isbn) => {
    const filterData = books.filter(item => { return item.isbn !== isbn })
    setBooks(filterData)
    localStorage.setItem('books', JSON.stringify(filterData))
    setSearch([])
  }

  const updateData = (isbn) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const filterData = books.find(item => { return item.isbn === isbn })
    setBook(filterData)
    setEditId(isbn)
    setToggle(false)
  }


  const handleSearch = (title) => {

    setSearch(title.target.value.toLowerCase())
    if (search === '') {
      setSearchData([])
    }
    const filterData = () => books.filter(
      searchItem => {
        return searchItem.title.toLowerCase().includes(search.toLowerCase())
      })
    const data = filterData()
    setSearchData(data)
  }


  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books))
  }, [book, search])

  return (
    <div>
      <div className="book">
        <h2>Book List</h2>
        <p>It's a Local Storage Project </p>
      </div>

      <div className='main mt-5 w-100 p-5'>
        <div className='book_from w-100'>
          <form className='form-control from d-flex' onSubmit={handleSubmit}>
            <div className='ms-4'>
              <label>Title</label>
              <input className="form-control" type="Text" id="formFileMultiple" name='title' onChange={handleOnchange} value={book.title} required />
            </div>
            <div className='ms-4'>
              <label >Author Name</label>
              <input className="form-control" type="Text" id="formFileMultiple" name='author' onChange={handleOnchange} value={book.author} required />
            </div>
            <div className='ms-4'>
              <label >ISBN#</label>
              <input className="form-control" type="Text" id="formFileMultiple" name='isbn' onChange={handleOnchange} value={book.isbn.slice(0, 7)} disabled />
            </div>

            <div className='ms-4 w-25'>
              <input className="form-control  bg-primary text-white " type="submit" value={toggle ? 'Add' : 'Update'} />
            </div>

          </form>
        </div>

        {/* search */}

        <div className='d-flex mt-4 justify-content-end  w-100'>
          <div className=' w-25 '>
            <label >Search</label>
            <input className="form-control" type="Text" id="formFileMultiple" name='isbn'
              onChange={(text) => handleSearch(text)} placeholder='search by "TITLE"' />
          </div>
        </div>


        <div className='book_table  form-control lg-ms-3 table-responsive mt-4'>
          <table className="table p-5 table-bordered table-striped w-100" style={{ height: "auto" }} >
            <thead >
              <tr >
                <th >ID</th>
                <th>Bk Title</th>
                <th >Atr Name</th>
                <th colSpan={2} >Action</th>
              </tr>
            </thead>

            <tbody>
              {
                search?.length > 0 ?
                  searchData?.map(bkItem =>
                    <tr key={bkItem.isbn}>
                      <th scope="row">{bkItem.isbn.slice(0, 5)}</th>
                      <td>{bkItem.title}</td>
                      <td >
                        {bkItem.author}
                      </td>
                      <td>
                        <i className="fa-regular fa-pen-to-square text-primary" style={{ cursor: 'pointer' }} onClick={() => updateData(bkItem.isbn)}></i>
                      </td>
                      <td>
                        <i className="fa-solid fa-trash text-danger" style={{ cursor: 'pointer' }} onClick={() => deleteData(bkItem.isbn)}></i>
                      </td>
                    </tr>) :
                  books.map(bkItem =>
                    <tr key={bkItem.isbn}>
                      <th scope="row">{bkItem.isbn.slice(0, 5)}</th>
                      <td>{bkItem.title}</td>
                      <td >
                        {bkItem.author}
                      </td>
                      <td>
                        <i className="fa-regular fa-pen-to-square text-primary" style={{ cursor: 'pointer' }} onClick={() => updateData(bkItem.isbn)}></i>
                      </td>
                      <td>
                        <i className="fa-solid fa-trash text-danger" style={{ cursor: 'pointer' }} onClick={() => deleteData(bkItem.isbn)}></i>
                      </td>
                    </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default App;
