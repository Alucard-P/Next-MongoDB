import Movie from "@/models/Movie";
import conectarDB from "@/lib/dbConnect";
import Link from "next/link";
import { useRouter } from "next/router";

const MoviePage = ({ success, error, movie }) => {
  const router = useRouter();

  if (!success) {
    return (
      <div className="container text-center my-5">
        <h1>{error}</h1>
        <Link href={"/"}>
          <p className="btn btn-success">Volver</p>
        </Link>
      </div>
    );
  }

  const deleteData = async (id) => {
    try {
      await fetch(`/api/movie/${id}`, {
        method: "DELETE",
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Detalle del Movie</h1>
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h5 className="text-uppercase">{movie.title}</h5>
          </div>
          <p className="fw-light">{movie.plot}</p>
          <Link href={"/"}>
            <span className="btn btn-success btn-sm me-3">Volver...</span>
          </Link>
          <Link href={`/${movie._id}/edit`}>
            <span className="btn btn-warning btn-sm me-3">Editar</span>
          </Link>
          <button
            className="btn btn-danger btn-sm "
            onClick={() => {
              deleteData(movie._id);
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;

export const getServerSideProps = async ({ params }) => {
  try {
    await conectarDB();
    const movie = await Movie.findById(params.id).lean();
    if (!movie)
      return { props: { success: false, error: "Pelicula no encontrada" } };
    movie._id = `${movie._id}`;

    return { props: { success: true, movie } };
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return { props: { success: false, error: "Id no valido" } };
    }
    return { props: { success: false, error: "Error de servidor" } };
  }
};
