/*
 * Generates a string from the given format and set of named arguments.
 *
 * Arguments:
 *   formatString: (String) contains substitution expressions of the form %foo%,
 *     where "foo" is a substitution name. The same substitution expression can
 *     appear multiple times in the string. Substitution names must be words
 *     (alphanumeric plus underscore). The expression %% can appear as well,
 *     which will be replaced with a single percent (%).
 *   arg: (String) the value that will be substituted for the substitution name
 *     'data'.
 *   moreArgs: (Object) an object whose property names are additional
 *     substitution names and whose values are the strings to substitute for
 *     the substitution expressions corresponding to those names.
 * Returns: a string with the substitution expressions replaced by the
 *   corresponding values in arg and moreArgs (if supplied). If an expression
 *   has no corresponding value, it will be replaced by the empty string.
 */
var format = function (formatString, arg, moreArgs) {
    var escapeExpr = /%(\w*)%/g,
        result = [],
        lastIndex = 0,
        argName;
    while ((match = escapeExpr.exec(formatString)) !== null) {
        // append everything from the end of the last match up to the start of
        // this match
        result.push(formatString.slice(lastIndex, match.index));
        // push the arg corresponding to the matched escape expression
        argName = match[1];
        if (!argName) {
            result.push('%');
        } else if (argName === 'data' && arg) {
            result.push(arg);
        } else if (moreArgs && moreArgs.hasOwnProperty(argName)) {
            result.push(moreArgs[argName]);
        }
        // remember where the end of this match is; the next iteration picks up
        // from there
        lastIndex = escapeExpr.lastIndex;
    }
    // if there's anything left at the end of the string, append it
    result.push(formatString.slice(lastIndex));
    return result.join('');
};

var bio = {
    name: "Owen Smith",
    role: "Software Wrangler",
    contacts: {
        mobile: "510-684-5434",
        email: "ods94043@yahoo.com",
        github: "ods94065",
        twitter: "ods94043",
        location: "Redwood City, CA"
    },
    welcomeMessage: "I'm a senior software developer with particular " +
        "interest in emerging internet technologies, programming languages, " +
        "and functional programming.",
    skills: [
        "web development",
        "deployment",
        "software architecture",
        "leadership",
        "mentoring"
    ],
    biopic: "images/owen.jpg",
    display: function () {
        header = $('#header');

        // these need to go before the contact list
        header.prepend(
            format(HTMLheaderName, this.name),
            format(HTMLheaderRole, this.role));

        $('#topContacts').append(
            $.map(this.contacts, this.formatContact));

        // these go after the contact list
        header.append(
            format(HTMLbioPic, this.biopic),
            format(HTMLwelcomeMsg, this.welcomeMessage),
            HTMLskillsStart);

        // this element was in HTMLskillsStart and can now be accessed
        $('#skills').append(
            $.map(this.skills, this.formatSkill));

        // footer gets same set of skills
        $('#footerContacts').append(
            $.map(this.contacts, this.formatContact));
    },
    formatSkill: function (skill) {
        return format(HTMLskills, skill);
    },
    formatContact: function (contactValue, fieldName) {
        return format(HTMLcontactGeneric, contactValue, {contact: fieldName});
    }
};

var education = {
    schools: [
        {
            name: 'Stanford University',
            location: 'Stanford, CA',
            degree: 'BA',
            majors: ['Music'],
            dates: 2003,
            url: 'http://www.stanford.edu'
        }
    ],
    onlineCourses: [
        {
            title: 'Front-End Nanodegree',
            school: 'Udacity',
            date: 2015,
            url: 'https://www.udacity.com'
        }
    ],
    display: function () {
        var education = $('#education');
        education.append(
            $.map(this.schools, this.formatSchool),
            HTMLonlineClasses,
            $.map(this.onlineCourses, this.formatOnlineCourse)
        );
    },
    formatSchool: function (school) {
        var schoolLink = $(
            format(HTMLschoolName, school.name) +
                format(HTMLschoolDegree, school.degree)
        );
        schoolLink.attr('href', school.url);
        return $(HTMLschoolStart).append(
            schoolLink,
            format(HTMLschoolDates, school.dates),
            format(HTMLschoolLocation, school.location),
            format(HTMLschoolMajor, school.majors.join(', '))
        );
    },
    formatOnlineCourse: function (course) {
        var courseLink = $(
            format(HTMLonlineTitle, course.title) +
                format(HTMLonlineSchool, course.school)
        );
        courseLink.attr('href', course.url);
        return $(HTMLschoolStart).append(
            courseLink,
            format(HTMLonlineDates, course.date),
            format(HTMLonlineURL, course.url)
        );
    }
};

var work = {
    jobs: [
        {
            employer: 'Udacity, Inc.',
            title: 'Back-End Engineering Lead',
            location: 'Mountain View, CA',
            dates: '2013–present',
            description: 'I am leading a small, elite team of engineers to ' +
                'revolutionize the world of education. Most of my work is in ' +
                'a support role, guiding and reviewing the work of the team ' +
                'across all back-end systems.',
        },
        {
            employer: 'PayPal, Inc.',
            title: 'Senior Member of Technical Staff',
            location: 'San Jose, CA',
            dates: '2003–2013',
            description: 'I started at PayPal as a nearly entry-level ' +
                'software engineer and concluded as one of the leaders of ' +
                'the engineering and operations organizations.',
        }
    ],
    display: function () {
        $('#workExperience').append(
            $.map(this.jobs, this.formatJob));
    },
    formatJob: function (job) {
        var employerAndTitle = format(HTMLworkEmployer, job.employer) +
            format(HTMLworkTitle, job.title);
        return $(HTMLworkStart).append(
            employerAndTitle,
            format(HTMLworkLocation, job.location),
            format(HTMLworkDates, job.dates),
            format(HTMLworkDescription, job.description)
        );
    }
 };

var projects = {
    projects: [
        {
            title: 'Optimize Video Upload Pipeline',
            dates: '2015',
            description: 'Brought the video upload success rate from 80% to ' +
                'over 98% by fixing race conditions and instituting ' +
                'queue-based throttling of YouTube API calls.',
            images: ['images/youtube.png']
        },
        {
            title: 'Launch Udacity\'s Paid Course Offering',
            dates: '2013–2014',
            description: 'Refactored email templates and finished off paid ' +
                'course enrollment subsystem.',
            images: ['images/vidya.png']
        },
        {
            title: 'PayPal Standard Base',
            dates: '2010–2011',
            description: 'Technical lead and architect of a project to ' +
                'migrate the entire development organization to a new ' +
                'operating system; helped document and standardize ' +
                'development tool and library versions.',
            images: ['images/redhat.jpg']
        }
    ],
    display: function () {
        $('#projects').append(
            $.map(this.projects, this.formatProject));
    },
    formatProject: function (project) {
        return $(HTMLprojectStart).append(
            format(HTMLprojectTitle, project.title),
            format(HTMLprojectDates, project.dates),
            format(HTMLprojectDescription, project.description),
            $.map(project.images, function (image) {
                return format(HTMLprojectImage, image);
            })
        );
    }
};

[bio, education, work, projects].forEach(function (section) {
    section.display();
});
$('#mapDiv').append(googleMap);
