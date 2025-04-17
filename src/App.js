import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { certificados } from "./recursos/certificados";
import { certificates } from "./recursos/certificates";
import { estudios } from "./recursos/estudios";
import { studies } from "./recursos/studies";
import { proyectos } from "./recursos/proyectos";
import { projects } from "./recursos/projects";
import { personal } from "./recursos/personal";
import { me } from "./recursos/me";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import pathEarth from "./texturas/tierra.jpeg";
import pathSatelite from "./texturas/sataliteF.glb";
import axios from "axios";

const formspreeEndpoint = process.env.REACT_APP_FORMSPREE_URL;
const linkedinProfile = process.env.REACT_APP_LINKEDIN_URL;
const githubProfile = process.env.REACT_APP_GITHUB_URL;
const name = process.env.REACT_APP_MY_NAME;

const App = () => {
  const [idioma, setIdioma] = useState(0);
  const [indices, setIndices] = useState(Array(10).fill(1));
  const [msgEnv, setMsg] = useState();
  const containerRef = useRef();


  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, -1, 4);
      scene.add(light);
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    camera.position.setZ(getZ());

    renderer.render(scene, camera);
    const texture = new THREE.TextureLoader().load(pathEarth);

    const loader = new GLTFLoader();

    for (let i = 0; i < 100; i++) {
      scene.add(addStars());
    }

    loader.load(pathSatelite, function (gltf) {
      var object = gltf.scene;
      object.scale.set(0.2, 0.2, 0.1);
      object.position.set(3, 3, 0);
      object.rotateX(180);
      object.rotateY(170);
      scene.add(object);
      renderer.render(scene, camera);
    });

    loader.load(pathSatelite, function (gltf) {
      var object = gltf.scene;
      object.scale.set(0.2, 0.2, 0.2);
      object.position.set(0, 2, -2.5);
      object.rotateX(180);
      object.rotateY(50);

      scene.add(object);
      renderer.render(scene, camera);
    });

    const material = new THREE.MeshPhongMaterial({
      bumpMap: texture,
      map: texture,
      transparent: true,
      opacity: 0.7,
    });

    const earth = makeInstance(
      new THREE.SphereGeometry(normalize(1.1, 1.7, 0.9), 32, 16),
      material,
      normalize(0, 2, 0.7),
      -0.5
    );
    scene.add(earth);
    
    const moveCamera=()=> {
      const t = document.body.getBoundingClientRect().top;
      camera.position.y = t * +0.01;
    }
    
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.x += 0.01;
      earth.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    document.body.onscroll = moveCamera;
    moveCamera();
    animate();
  }, []);

  const makeInstance = (geometry, material, x, y) => {
    const figure = new THREE.Mesh(geometry, material);
    figure.position.x = x;
    figure.position.y = y;
    return figure;
  };

  const addStars = () => {
    const geometry = new THREE.SphereGeometry(0.3, 0.5, -5);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    const x1 = Array(1)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(200));
    const y = Array(1)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(250));
    star.position.set(x1, y, -50);
    return star;
  };

  const getZ=()=> {
    const clientwWidth = document.documentElement.clientWidth;
    if (clientwWidth < 600) {
      return 8;
    } else if (clientwWidth >= 600 && clientwWidth <= 900) {
      return 5;
    }
    return 4;
  }

  const normalize=(minDestination, maxDestination, percentage)=> {
    const minOriginal = 0;
    const maxOriginal = document.documentElement.clientWidth;
    const viewportWidth = document.documentElement.clientWidth * percentage;
    const clampedWidth = Math.max(
      minOriginal,
      Math.min(maxOriginal, viewportWidth)
    );
    return (
      ((clampedWidth - minOriginal) / (maxOriginal - minOriginal)) *
      (maxDestination - minDestination) + minDestination
    );
  }

  const sendMsg = (e) => {
    e.preventDefault();
    if (e.target.contacto.value === "" || e.target.mensaje.value === "") {
      setMsg(idioma === 1 ? "Please complete all fields." : "Por favor, completa todos los campos.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
      return;
    }
    axios
      .post(formspreeEndpoint, new FormData(e.target))
      .then((response) => {
        if (response.status === 200) {
          setMsg(idioma === 1 ? "Your message has been sent." : "Tu mensaje ha sido enviado.");
          setTimeout(() => {
            setMsg("");
          }, 4000);
        }
      })
      .catch((error) => {
        console.log("el mensaje no pudo ser enviado");
      });
  };

  return (
    <>
      <div ref={containerRef} />
      <main className="main">
        <blockquote className="languages">
          {(idioma === 0 && (
            <>
              <button
                onClick={() => {
                  setIdioma(0);
                }}
              >
                Español
              </button>
              <button
                onClick={() => {
                  setIdioma(1);
                }}
              >
                Ingles
              </button>
            </>
          )) || (
            <>
              <button
                onClick={() => {
                  setIdioma(0);
                }}
              >
                Spanish
              </button>
              <button
                onClick={() => {
                  setIdioma(1);
                }}
              >
                English
              </button>
            </>
          )}
        </blockquote>
        <div>
          <h1 className="name title">{name}</h1>
        </div>
        <div className="content">
          {(idioma === 0 && (
            <>
              <p>
                <a href="#about">Sobre mi</a>
              </p>
              <p>
                <a href="#studies">Estudios</a>
              </p>
              <p>
                <a href="#projects">Proyectos</a>
              </p>
              <p>
                <a href="#experience">Experiencia</a>
              </p>
              <p>
                <a href="#contact">Contacto</a>
              </p>
            </>
          )) || (
            <>
              <p>
                <a href="#about">About me</a>
              </p>
              <p>
                <a href="#studies">Studies</a>
              </p>
              <p>
                <a href="#projects">Projects</a>
              </p>
              <p>
                <a href="#experience">Experience</a>
              </p>
              <p>
                <a href="#contact">Contact</a>
              </p>
            </>
          )}
        </div>

        <div className="separator rigth" id="about">
          <div className="container">
            <img
              className="personalImage"
              src="logos/miImagen.png"
              alt="Gabriela"
              title="Gabriela"
            />
            <div className="rightContainer">
              <h2 className="specialTitle aboutTitle">
                {idioma === 0 ? "Sobre mi" : "About me"}
              </h2>
              <section className="description">
                {(idioma === 0 && <p>{personal.sobre}</p>) || <p>{me.sobre}</p>}
              </section>
            </div>
          </div>
          <h2 className="specialTitle">
            {idioma === 0 ? "Habilidades técnicas" : "Technical Skills"}
          </h2>
          <section className="description">
            {(idioma === 0 &&
              personal.conocimientos.map((item, i) => (
                <p key={`kn-${i}`}>{item}</p>
              ))) ||
              me.conocimientos.map((item, i) => <p key={`$cn-${i}`}>{item}</p>)}
          </section>
        </div>
        <div className="logos">
          <img src="logos/web.png"></img>
          <img src="logos/spring.png"></img>
          <img src="logos/type.png"></img>
          <img src="logos/node.png"></img>
          <img src="logos/mysql.png"></img>
          <img src="logos/mongo.png"></img>
          <img src="logos/flutter.png"></img>
          <img src="logos/docker.png"></img>
          <img src="logos/github.png"></img>
          <img src="logos/python.png"></img>
          <img src="logos/react.png"></img>
          <img src="logos/linux.png"></img>
          <img src="logos/gcp.png"></img>
          <img src="logos/aws.png"></img>
          <img src="logos/java.png"></img>
          <img src="logos/angular.png"></img>
        </div>

        <div>
          <h2 className="specialTitle">
            {idioma === 0 ? "Idiomas" : "Languages"}
          </h2>
          <div className="flex-row">
            {(idioma === 0 && (
              <>
                <div className="flex-column">
                  <b>Español</b>
                  <p>Nativo</p>
                </div>
                <div className="flex-column">
                  <b>Ingles</b>
                  <p>B2</p>
                </div>
              </>
            )) || (
              <>
                <div className="flex-column">
                  <b>Spanish</b>
                  <p>Native</p>
                </div>
                <div className="flex-column">
                  <b>English</b>
                  <p>B2</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div id="studies">
          <h2 className="specialTitle">
            {idioma === 0 ? "Estudios" : "Studies"}
          </h2>
          <table>
            <tbody>
              {(idioma === 0 &&
                estudios.map((item, i) => (
                  <tr key={`st-${i}`}>
                    <td>
                      <section>
                        <p className="title">{item.duracion}</p>
                        <p className="biomeFont">{item.lugar}</p>
                      </section>
                    </td>
                    <td>
                      <section>
                        <p className="title">{item.curso}</p>
                        <p className="cambriaFont">{item.institucion}</p>
                      </section>
                    </td>
                  </tr>
                ))) ||
                studies.map((item, i) => (
                  <tr key={`stu-${i}`}>
                    <td>
                      <section>
                        <p>{item.duracion}</p>
                        <p>{item.lugar}</p>
                      </section>
                    </td>
                    <td>
                      <section>
                        <p>{item.curso}</p>
                        <p>{item.institucion}</p>
                      </section>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div id="certificados">
          <h2 className="specialTitle">
            {idioma === 0 ? "Certificados" : "Certificates"}
          </h2>
          <table>
            <tbody>
              {(idioma === 0 &&
                certificados.map((item, i) => (
                  <tr key={`id-${i}`}>
                    <td>
                      <section>
                        <p className="title">{item.duracion}</p>
                        <p className="biomeFont">{item.lugar}</p>
                      </section>
                    </td>
                    <td>
                      <section>
                        <p className="title">{item.curso}</p>
                        <p className="cambriaFont">{item.institucion}</p>
                      </section>
                    </td>
                  </tr>
                ))) ||
                certificates.map((item, i) => (
                  <tr key={`idi-${i}`}>
                    <td>
                      <section>
                        <p>{item.duracion}</p>
                        <p>{item.lugar}</p>
                      </section>
                    </td>
                    <td>
                      <section>
                        <p>{item.curso}</p>
                        <p>{item.institucion}</p>
                      </section>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="separator espacio" id="projects">
          <h2 className="specialTitle">
            {idioma === 0 ? "Proyectos" : "Projects"}
          </h2>
          {(idioma === 0 &&
            proyectos.map((item, index) => (
              <div key={`div-${index}`}>
                <h3 className="projects">{item.titulo}</h3>
                <section className="projects">
                  <p>{item.descripcion}</p>
                  <b className="inline">Tags: </b>
                  <p className="inline">{item.tags}</p>
                  {item.total > 0 && (
                    <div className="galleryP">
                      <div
                        className="arrowLeft"
                        onClick={() => {
                          const nuevo = [...indices];
                          nuevo[index] - 1 < 1
                            ? (nuevo[index] = item.total - 1)
                            : (nuevo[index] = nuevo[index] - 1);
                          setIndices(nuevo);
                        }}
                      ></div>
                      <div
                        className="arrowRight"
                        onClick={() => {
                          const nuevo = [...indices];
                          nuevo[index] + 1 > item.total - 1
                            ? (nuevo[index] = 1)
                            : (nuevo[index] = nuevo[index] + 1);
                          setIndices(nuevo);
                        }}
                      ></div>

                      <img
                        className="projectImg"
                        src={
                          "recursosPro/" +
                          item.folder +
                          "/" +
                          indices[index] +
                          ".png"
                        }
                        alt="Project"
                      />
                    </div>
                  )}
                  <div className="links">
                    {item.codigo && (
                      <a href={item.codigo} target="blank">
                        Código
                      </a>
                    )}
                    {item.pagina && (
                      <a href={item.pagina} target="blank">
                        Página
                      </a>
                    )}
                  </div>
                </section>
              </div>
            ))) ||
            projects.map((item, index) => (
              <div key={`div2-${index}`}>
                <h3 className="projects">{item.titulo}</h3>
                <section className="projects">
                  <p>{item.descripcion}</p>
                  <b className="inline">Tags: </b>
                  <p className="inline">{item.tags}</p>
                  {item.total > 0 && (
                    <div className="galleryP">
                      <div
                        className="arrowLeft"
                        onClick={() => {
                          const nuevo = [...indices];
                          nuevo[index] - 1 < 1
                            ? (nuevo[index] = item.total - 1)
                            : (nuevo[index] = nuevo[index] - 1);
                          setIndices(nuevo);
                        }}
                      ></div>
                      <div
                        className="arrowRight"
                        onClick={() => {
                          const nuevo = [...indices];
                          nuevo[index] + 1 > item.total - 1
                            ? (nuevo[index] = 1)
                            : (nuevo[index] = nuevo[index] + 1);
                          setIndices(nuevo);
                        }}
                      ></div>
                      <div className="projectContainer">
                        <img
                          className="projectImg"
                          src={
                            "recursosPro/" +
                            item.folder +
                            "/" +
                            indices[index] +
                            ".png"
                          }
                          alt="Project"
                        />
                      </div>
                    </div>
                  )}
                  <div className="links">
                    {item.codigo && (
                      <a href={item.codigo} target="blank">
                        Code
                      </a>
                    )}
                    {item.pagina && (
                      <a href={item.pagina} target="blank">
                        Page
                      </a>
                    )}
                  </div>
                </section>
              </div>
            ))}
        </div>
        <div id="experience">
          <h2 className="specialTitle">
            {idioma === 0 ? "Experiencia" : "Experience"}
          </h2>
          {(idioma === 0 && (
            <table>
              <tbody>
                {personal.experiencia.map((item, i) => (
                  <tr key={`ex-${i}`}>
                    <td>
                      <section>
                        <p className="title">{item.fecha}</p>
                        <p className="biomeFont">{item.empresa}</p>
                      </section>
                    </td>
                    <td>
                      <section>
                        <p className="title">{item.rol}</p>
                        <p className="cambriaFont">{item.desc}</p>
                      </section>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )) || (
            <table>
              <tbody>
                {me.experiencia.map((item, i) => (
                  <tr key={`exp-${i}`}>
                    <td>
                      <section>
                        <p className="title">{item.fecha}</p>
                        <p className="biomeFont">{item.empresa}</p>
                      </section>
                    </td>
                    <td>
                      <section>
                        <p className="title">{item.rol}</p>
                        <p className="cambriaFont">{item.desc}</p>
                      </section>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div id="competencias">
          <h2 className="specialTitle">
            {idioma === 0 ? "Competencias" : "Competencies"}
          </h2>
          <table>
            <tbody>
              <tr>
                <td>
                  <section>
                    <p className="title">2022</p>
                    <p className="biomeFont">
                      Society for Industrial and Applied Mathematics
                    </p>
                  </section>
                </td>
                <td>
                  <section>
                    <p className="title">Math Modeling Challenge CoSIAM 2022</p>
                    <p className="cambriaFont">
                      {idioma === 0 ? "Equipo ganador" : "Winning Team"}
                    </p>
                  </section>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="separator contact" id="contact">
          <h2 className="specialTitle">
            {idioma === 0 ? "Contacto" : "Contact"}
          </h2>
          <form className="form" onSubmit={sendMsg}>
            <label>
              {idioma === 0 ? "Información de contacto" : "Contact information"}
            </label>
            <input type="text" name="contacto" />
            <label>{idioma === 0 ? "Mensaje" : "Message"}</label>
            <textarea
              className="form-control"
              rows="3"
              name="mensaje"
            ></textarea>
            <button
              type="submit"
              className="sendBtn btn btn-dark btn-outline-warning btn-block"
            >
              {idioma === 0 ? "Enviar" : "Send"}
            </button>
          </form>
          {msgEnv && (
            <div className="msg">
              <p>{msgEnv}</p>
            </div>
          )}
        </div>
        <div className="icons media">
          <a
            href={linkedinProfile}
            className="fa-brands fa-linkedin fa-2x links"
            target="_blank"
          ></a>
          <a
            href={githubProfile}
            target="_blank"
            className="fa-brands fa-github fa-2x links"
          ></a>
        </div>
      </main>
    </>
  );
};

export default App;
