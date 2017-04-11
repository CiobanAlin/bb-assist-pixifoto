/*jshint esversion: 6 */

'use strict';

//-----------------------------------------------------------------------
//  @IMPORTS
//-----------------------------------------------------------------------

/* beautify preserve:start */
import browser          from 'browser-sync';
import fs               from 'fs';
import gulp             from 'gulp';
import gulpLiveReload   from 'gulp-livereload';
import panini           from 'panini';
import plugins          from 'gulp-load-plugins';
import rimraf           from 'rimraf';
import yaml             from 'js-yaml';
import yargs            from 'yargs';
/* beautify preserve:end */





//-----------------------------------------------------------------------
//  @VARIABLES
//-----------------------------------------------------------------------

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const {
    COMPATIBILITY,
    PORT,
    UNCSS_OPTIONS,
    PATHS
} = loadConfig();

function loadConfig() {
    let ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);
}





//-----------------------------------------------------------------------
//  @BUILD
//-----------------------------------------------------------------------

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
    gulp.series(clean, gulp.parallel(pages, sass, javascriptVendor, javascriptCustom, images, copy)));

// Build the site, run the server, and watch for file changes
gulp.task('default',
    gulp.series('build', server, watch));





//-----------------------------------------------------------------------
//  @CLEAN
//-----------------------------------------------------------------------

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
    rimraf(PATHS.release, done);
}





//-----------------------------------------------------------------------
//  @COPY
//-----------------------------------------------------------------------

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
    return gulp.src(PATHS.assets)
        .pipe(gulp.dest(PATHS.release + '/assets'));
}





//-----------------------------------------------------------------------
//  @PAGES @PANINI
//-----------------------------------------------------------------------

// Copy page templates into finished HTML files
// This can be used for prototyping or even for small sites
function pages() {
    return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
        .pipe(panini({
            root: 'src/pages/',
            layouts: 'src/layouts/',
            partials: 'src/partials/',
            data: 'src/data/',
            helpers: 'src/helpers/'
        }))
        .pipe(gulp.dest(PATHS.release));
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
    panini.refresh();
    done();
}





//-----------------------------------------------------------------------
//  @STYLEGUIDE
//-----------------------------------------------------------------------

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
    return gulp.src(PATHS.scssCustom)
        .pipe($.sourcemaps.init())
        .pipe($.sass({
                // includePaths: PATHS.scssVendor
            })
            .on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: COMPATIBILITY
        }))
        // Comment in the pipe below to run UnCSS in production
        .pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
        .pipe($.if(PRODUCTION, $.cssnano()))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(PATHS.release))
        .pipe(browser.reload({
            stream: true
        }));
}





//-----------------------------------------------------------------------
//  @JAVASCRIPT
//-----------------------------------------------------------------------

// Combine JavaScript into one file
// In production, the file is minified
function javascriptCustom() {
    return gulp.src(PATHS.javascriptCustom)
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.concat('app.js'))
        .pipe($.if(PRODUCTION, $.uglify()
            .on('error', e => {
                console.log(e);
            })
        ))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(PATHS.release));
}

// javascript files from different Vendors (Jquery, moustache, etc.)
function javascriptVendor() {
    return gulp.src(PATHS.javascriptVendor)
        .pipe($.babel())
        .pipe($.concat('vendor.js'))
        .pipe($.if(PRODUCTION, $.uglify()
            .on('error', e => {
                console.log(e);
            })
        ))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(PATHS.release));
}





//-----------------------------------------------------------------------
//  @IMAGES
//-----------------------------------------------------------------------

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
    return gulp.src(PATHS.images)
        .pipe($.if(PRODUCTION, $.imagemin({
            progressive: true
        })))
        .pipe(gulp.dest(PATHS.release + '/assets/img'));
}





//-----------------------------------------------------------------------
//  @SERVER
//-----------------------------------------------------------------------

// Start a server with BrowserSync to preview the site in
function server(done) {
    browser.init({
        server: PATHS.release,
        port: PORT
    });
    done();
}

// Reload the browser with BrowserSync
function reload(done) {
    browser.reload();
    done();
}





//-----------------------------------------------------------------------
//  @WATCH FILES
//-----------------------------------------------------------------------

// Watch for changes to static assets, pages, Scss, and JavaScript
function watch() {
    gulp.watch(PATHS.assets, copy);

    gulp.watch(PATHS.pages)
        .on('all', gulp.series(pages, reload));

    gulp.watch(PATHS.layouts)
        .on('all', gulp.series(resetPages, pages, reload));

    //  Inject the css without changing the DOM and refreshing the browser
    gulp.watch(PATHS.scssCustom)
        .on('all', gulp.series(sass, gulpLiveReload.changed));

    gulp.watch(PATHS.javascriptCustom)
        .on('all', gulp.series(javascriptCustom, reload));

    gulp.watch(PATHS.images)
        .on('all', gulp.series(images, reload));
}
